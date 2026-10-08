import { Inject, Injectable } from '@nestjs/common';
import { WHATSAPP_PROVIDER, WhatsappProvider } from '../../providers/whatsapp-provider.interface';
import { QueueService } from '../../queue/queue.service';

export interface WaCampaign {
  id: string;
  ownerId: string;
  template: string;
  mobiles: string[];
  status: string;
  queued: number;
  createdAt: string;
}

// TODO: swap with Prisma (Campaign type=wa + Message) when DB is up.
@Injectable()
export class WhatsappService {
  private campaigns: WaCampaign[] = [];

  constructor(
    @Inject(WHATSAPP_PROVIDER) private wa: WhatsappProvider,
    private queue: QueueService,
  ) {
    this.queue.registerHandler('wa-send', async (payload) => {
      const id = payload['campaignId'] as string;
      const c = this.campaigns.find((x) => x.id === id);
      if (!c) return;
      for (const to of c.mobiles) {
        await this.wa.sendTemplate(to, c.template, [], { campaignId: c.id });
      }
      c.status = 'completed';
    });
  }

  sendText(to: string, body: string, campaignId?: string): Promise<{ vendorId: string; status: string }> {
    return this.wa.sendText(to, body, { campaignId });
  }

  sendTemplate(to: string, template: string, params: string[] = []): Promise<{ vendorId: string; status: string }> {
    return this.wa.sendTemplate(to, template, params);
  }

  async createCampaign(ownerId: string, template: string, mobiles: string[]): Promise<WaCampaign> {
    const c: WaCampaign = {
      id: `wcp_${Date.now()}`,
      ownerId,
      template,
      mobiles,
      status: 'queued',
      queued: mobiles.length,
      createdAt: new Date().toISOString(),
    };
    this.campaigns.unshift(c);
    await this.queue.add('wa-send', { campaignId: c.id }, 50);
    return c;
  }

  listCampaigns(): WaCampaign[] {
    return this.campaigns;
  }

  pullTemplates(): Promise<Array<{ name: string; lang: string; body: string }>> {
    return this.wa.pullTemplates();
  }

  analytics(): Record<string, unknown> {
    // Mock analytics — TODO: aggregate Prisma Message rows by status.
    return {
      total: this.campaigns.reduce((n, c) => n + c.queued, 0),
      campaigns: this.campaigns.length,
      delivered: Math.floor(this.campaigns.reduce((n, c) => n + c.queued, 0) * 0.9),
      read: Math.floor(this.campaigns.reduce((n, c) => n + c.queued, 0) * 0.6),
    };
  }
}
