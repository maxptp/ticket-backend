import { Module } from '@nestjs/common';
import { TicketsService } from './ticket.service';
import { TicketsController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../model/ticket.entity';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), QueueModule],
  providers: [TicketsService],
  controllers: [TicketsController],
  exports: [TicketsService],
})
export class TicketModule {}
