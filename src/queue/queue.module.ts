import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TicketsProcessor } from './tickets.processor';
import { TicketsQueueService } from './tickets-queue.service';
import { AdminQueuesController } from './admin-queue.controller';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'tickets',
    }),
  ],
  providers: [TicketsProcessor, TicketsQueueService],
  controllers: [AdminQueuesController],
  exports: [TicketsQueueService],
})
export class QueueModule {}
