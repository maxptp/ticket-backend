import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('tickets')
export class TicketsProcessor extends WorkerHost {
  async process(job) {
    if (job.name === 'notify') {
      console.log(
        `🔔 TicketNotifyJob: Ticket ${job.data.ticketId} - ${job.data.title}`,
      );
    }

    if (job.name === 'sla') {
      console.warn(
        `⚠️ TicketSlaJob: SLA check for Ticket ${job.data.ticketId}`,
      );
    }
  }
}
