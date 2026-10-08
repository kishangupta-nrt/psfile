import { Injectable, Logger } from '@nestjs/common';

export interface DlrEvent {
  vendor: string;
  vendorId: string;
  status: string;
  mobile?: string;
  code?: string;
  raw: Record<string, unknown>;
  at: string;
}

// Mock DLR store — TODO: update Prisma Message rows (dlrCode/dlrText/status) when DB is up.
@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private events: DlrEvent[] = [];

  ingest(vendor: string, body: Record<string, unknown>): DlrEvent {
    const e: DlrEvent = {
      vendor,
      vendorId: String(body['vendorId'] ?? body['messageId'] ?? body['id'] ?? `mock-${Date.now()}`),
      status: String(body['status'] ?? 'delivered'),
      mobile: body['mobile'] ? String(body['mobile']) : undefined,
      code: body['code'] ? String(body['code']) : undefined,
      raw: body,
      at: new Date().toISOString(),
    };
    this.events.unshift(e);
    this.logger.log(`[dlr] vendor=${vendor} vendorId=${e.vendorId} status=${e.status}`);
    return e;
  }

  list(): DlrEvent[] {
    return this.events.slice(0, 100);
  }
}
