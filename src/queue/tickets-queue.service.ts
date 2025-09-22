import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Ticket } from '../model/ticket.entity';

@Injectable()
export class TicketsQueueService {
  constructor(@InjectQueue('tickets') private readonly queue: Queue) {}

  async enqueueTicketJobs(ticket: Ticket) {
    // Notify job
    await this.queue.add(
      'notify',
      { ticketId: ticket.id, title: ticket.title },
      {
        jobId: `notify-${ticket.id}`, // idempotent
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );

    // SLA job
    await this.queue.add(
      'sla',
      { ticketId: ticket.id, createdAt: ticket.createdAt },
      {
        jobId: `sla-${ticket.id}`,
        delay: 5000, // 15 minutes
      },
    );
  }

  async removeSlaJob(ticketId: number) {
    const job = await this.queue.getJob(`sla-${ticketId}`);
    if (job) {
      await job.remove();
      console.log(`🗑️ SLA job sla-${ticketId} removed`);
    } else {
      console.log(`ℹ️ SLA job sla-${ticketId} not found in queue`);
    }
  }

  async getStats() {
    return {
      waiting: await this.queue.getWaitingCount(),
      active: await this.queue.getActiveCount(),
      completed: await this.queue.getCompletedCount(),
      failed: await this.queue.getFailedCount(),
      delayed: await this.queue.getDelayedCount(),
    };
  }
}
