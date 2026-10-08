import { Injectable } from '@nestjs/common';

// TODO: replace mock rows with Prisma Campaign/Message queries when DB is up.
@Injectable()
export class ReportsService {
  campaignReport(filters: Record<string, unknown> = {}): { data: unknown[]; filters: Record<string, unknown> } {
    return {
      data: [
        { campaignId: 'cmp_demo', ownerId: 'u_customer', total: 100, delivered: 90, failed: 10 },
      ],
      filters,
    };
  }

  detailed(): { data: unknown[] } {
    return {
      data: [
        { messageId: 'msg_1', campaignId: 'cmp_demo', mobile: '9999999999', status: 'delivered', dlrCode: '0' },
        { messageId: 'msg_2', campaignId: 'cmp_demo', mobile: '8888888888', status: 'failed', dlrCode: '109' },
      ],
    };
  }

  delivery(): { data: unknown[] } {
    return { data: [{ date: new Date().toISOString().slice(0, 10), delivered: 90, failed: 10 }] };
  }
}
