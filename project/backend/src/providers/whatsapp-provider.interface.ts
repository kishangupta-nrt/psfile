export const WHATSAPP_PROVIDER = 'WHATSAPP_PROVIDER';

export interface WaSendOpts {
  campaignId?: string;
  headerParams?: string[];
}

export interface WaSendResult {
  vendorId: string;
  status: 'queued' | 'sent' | 'failed';
}

export interface WhatsappProvider {
  sendText(to: string, body: string, opts?: WaSendOpts): Promise<WaSendResult>;
  sendTemplate(to: string, template: string, params?: string[], opts?: WaSendOpts): Promise<WaSendResult>;
  pullTemplates(): Promise<Array<{ name: string; lang: string; body: string }>>;
}
