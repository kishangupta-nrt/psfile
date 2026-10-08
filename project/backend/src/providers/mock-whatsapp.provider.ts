import { Injectable, Logger } from '@nestjs/common';
import { WaSendOpts, WaSendResult, WhatsappProvider } from './whatsapp-provider.interface';

/**
 * Mock WhatsApp provider — no network. pullTemplates returns a static mock list.
 * TODO: add RealWhatsappProvider reading WA_BASE_URL / WA_TOKEN / WA_PHONE_ID from env.
 */
@Injectable()
export class MockWhatsappProvider implements WhatsappProvider {
  private readonly logger = new Logger(MockWhatsappProvider.name);

  async sendText(to: string, body: string, opts?: WaSendOpts): Promise<WaSendResult> {
    const vendorId = `mock-wa-${Date.now()}`;
    this.logger.log(`[mock-wa] text to=${to} campaign=${opts?.campaignId ?? '-'} body=${body.slice(0, 80)}`);
    return { vendorId, status: 'queued' };
  }

  async sendTemplate(to: string, template: string, params: string[] = [], opts?: WaSendOpts): Promise<WaSendResult> {
    const vendorId = `mock-wa-tpl-${Date.now()}`;
    this.logger.log(`[mock-wa] template to=${to} tpl=${template} params=${JSON.stringify(params)}`);
    return { vendorId, status: 'queued' };
  }

  async pullTemplates(): Promise<Array<{ name: string; lang: string; body: string }>> {
    return [
      { name: 'otp_login', lang: 'en', body: 'Your OTP is {{1}}. Valid for 10 mins.' },
      { name: 'order_update', lang: 'en', body: 'Hi {{1}}, your order {{2}} is {{3}}.' },
      { name: 'festival_offer', lang: 'hi', body: 'Namaste {{1}}, dhamaka offer: {{2}}!' },
    ];
  }
}
