import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { logWithTime, logErrorWithTime } from '../utils/logger.util';

@Processor('tickets')
export class TicketsProcessor extends WorkerHost {
  async process(job: Job) {
    if (job.name === 'notify') {
      logWithTime(
        `🔔 TicketNotifyJob START: Ticket ${job.data.ticketId} - "${job.data.title}" (jobId=${job.id})`,
      );
    }

    if (job.name === 'sla') {
      logWithTime(
        `⚠️ TicketSlaJob START: SLA check for Ticket ${job.data.ticketId} (jobId=${job.id})`,
      );
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    logWithTime(
      `▶️ Job ${job.name}-${job.id} is active (attempt ${job.attemptsMade + 1})`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    logWithTime(`✅ Job ${job.name}-${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    logErrorWithTime(
      `❌ Job ${job.name}-${job.id} failed (attempt ${job.attemptsMade})`,
      err,
    );
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job) {
    logWithTime(`⏸️ Job ${job.name}-${job.id} stalled`);
  }
}
