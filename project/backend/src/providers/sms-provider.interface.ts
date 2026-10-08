export const SMS_PROVIDER = 'SMS_PROVIDER';

export interface SendSmsOpts {
  senderId?: string;
  campaignId?: string;
  scheduledAt?: string;
  language?: string;
}

export interface SmsSendResult {
  vendorId: string;
  status: 'queued' | 'sent' | 'failed';
}

export interface SmsProvider {
  send(to: string, body: string, opts?: SendSmsOpts): Promise<SmsSendResult>;
  getBalance(): Promise<number>;
}
