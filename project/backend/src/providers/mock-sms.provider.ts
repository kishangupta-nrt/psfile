import { Injectable, Logger } from '@nestjs/common';
import { SendSmsOpts, SmsProvider, SmsSendResult } from './sms-provider.interface';

/**
 * Mock SMS provider — logs and returns vendorId `mock-*`. No network calls.
 * TODO: add RealSmsProvider reading SMS_VENDOR_BASE / SMS_VENDOR_KEY from env when vendor is chosen.
 */
@Injectable()
export class MockSmsProvider implements SmsProvider {
  private readonly logger = new Logger(MockSmsProvider.name);

  async send(to: string, body: string, opts?: SendSmsOpts): Promise<SmsSendResult> {
    const vendorId = `mock-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    this.logger.log(`[mock-sms] to=${to} sender=${opts?.senderId ?? 'default'} campaign=${opts?.campaignId ?? '-'} body=${body.slice(0, 80)} vendorId=${vendorId}`);
    return { vendorId, status: 'queued' };
  }

  async getBalance(): Promise<number> {
    return 999999;
  }
}
