import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TicketsQueueService } from './tickets-queue.service';

@Controller('admin/queues')
export class AdminQueuesController {
  constructor(private readonly queueService: TicketsQueueService) {}

  @Get(':name/stats')
  async getStats(@Param('name') name: string) {
    if (name !== 'tickets') {
      throw new NotFoundException(`Queue "${name}" not found`);
    }
    return this.queueService.getStats();
  }
}
