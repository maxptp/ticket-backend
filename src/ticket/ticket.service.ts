import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../model/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ListTicketsQueryDto } from './dto/list-tickets-query.dto';
import { TicketsQueueService } from '../queue/tickets-queue.service';
import { logWithTime } from 'src/utils/logger.util';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    private readonly queueService: TicketsQueueService,
  ) {}

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketRepo.create(dto);
    const saved = await this.ticketRepo.save(ticket);

    logWithTime(
      `🆕 Ticket ${saved.id} created: "${saved.title}" (priority=${saved.priority}, status=${saved.status})`,
    );

    await this.queueService.enqueueTicketJobs(saved);

    return saved;
  }

  async update(id: number, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    Object.assign(ticket, dto);
    const saved = await this.ticketRepo.save(ticket);

    if (dto.status === TicketStatus.RESOLVED) {
      saved.resolvedAt = new Date();
      await this.queueService.removeSlaJob(id);
      await this.ticketRepo.save(saved);
    }

    return saved;
  }

  async findAll(query: ListTicketsQueryDto) {
    const {
      status,
      priority,
      search,
      page = 1,
      pageSize = 10,
      sortBy,
      sortOrder,
    } = query;

    const qb = this.ticketRepo.createQueryBuilder('ticket');

    if (status) {
      qb.andWhere('ticket.status = :status', { status });
    }

    if (priority) {
      qb.andWhere('ticket.priority = :priority', { priority });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(ticket.title) LIKE :search OR LOWER(ticket.description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const allowedSortFields = ['createdAt', 'updatedAt', 'priority', 'status'];
    const sortField = allowedSortFields.includes(sortBy as string)
      ? sortBy
      : 'createdAt';

    const sortDirection = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`ticket.${sortField}`, sortDirection);

    qb.skip((page - 1) * pageSize).take(pageSize);

    const [data, total] = await qb.getManyAndCount();

    logWithTime(`📋 Retrieved ${data.length} tickets`);

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: pageSize,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) {
      logWithTime(`❓ Ticket ${id} not found`);
      throw new NotFoundException(`Ticket ${id} not found`);
    }
    logWithTime(
      `📄 Retrieved Ticket ${ticket.id}: "${ticket.title}" (priority=${ticket.priority}, status=${ticket.status})`,
    );
    return ticket;
  }

  async softDelete(id: number): Promise<void> {
    const ticket = await this.findOne(id);
    const result = await this.ticketRepo.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
    logWithTime(`🗑️ Ticket ${ticket.id} - "${ticket.title}" soft-deleted`);
  }
}
