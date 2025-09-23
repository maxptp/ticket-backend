import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Ticket } from '../model/ticket.entity';
import { logWithTime } from 'src/utils/logger.util';

@Injectable()
export class TicketsQueueService {
  constructor(@InjectQueue('tickets') private readonly queue: Queue) {}

  async enqueueTicketJobs(ticket: Ticket) {
    await this.queue.add(
      'notify',
      { ticketId: ticket.id, title: ticket.title },
      {
        jobId: `notify-${ticket.id}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );

    await this.queue.add(
      'sla',
      { ticketId: ticket.id, createdAt: ticket.createdAt },
      {
        jobId: `sla-${ticket.id}`,
        delay: 15 * 60 * 1000, // 15 minutes
      },
    );

    logWithTime(
      `📥 Enqueued NotifyJob (notify-${ticket.id}) with attempts=3, backoff=exponential(1000ms)`,
    );

    logWithTime(`📥 Enqueued SlaJob (sla-${ticket.id}) with delay=15m`);
  }

  async removeSlaJob(ticketId: number) {
    const job = await this.queue.getJob(`sla-${ticketId}`);
    if (job) {
      await job.remove();
      logWithTime(`🗑️ SLA job sla-${ticketId} removed`);
    } else {
      logWithTime(`ℹ️ SLA job sla-${ticketId} not found in queue`);
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
