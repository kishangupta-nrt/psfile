import { Inject, Injectable } from '@nestjs/common';
import { SMS_PROVIDER, SmsProvider } from '../../providers/sms-provider.interface';
import { WALLET_PROVIDER, WalletProvider } from '../../providers/wallet-provider.interface';
import { QueueService } from '../../queue/queue.service';
import { AppError } from '../../common/errors';

export interface Campaign {
  id: string;
  ownerId: string;
  senderId?: string;
  message: string;
  mobiles: string[];
  status: 'queued' | 'sending' | 'stopped' | 'completed' | 'failed';
  total: number;
  delivered: number;
  failed: number;
  jobId?: string;
  createdAt: string;
}

export interface CreateCampaignDto {
  ownerId: string;
  senderId?: string;
  message: string;
  mobiles: string[];
}

// TODO: swap in-memory store with Prisma Campaign + Message models when DB is up.
@Injectable()
export class CampaignsService {
  private campaigns: Campaign[] = [];

  constructor(
    @Inject(SMS_PROVIDER) private sms: SmsProvider,
    @Inject(WALLET_PROVIDER) private wallet: WalletProvider,
    private queue: QueueService,
  ) {
    // Register mock job handler: sms-send fans out via SmsProvider in mock mode.
    this.queue.registerHandler('sms-send', async (payload) => {
      const campaignId = payload['campaignId'] as string;
      const c = this.campaigns.find((x) => x.id === campaignId);
      if (!c || c.status === 'stopped') return;
      c.status = 'sending';
      let delivered = 0;
      for (const to of c.mobiles) {
        try {
          await this.sms.send(to, c.message, { senderId: c.senderId, campaignId: c.id });
          delivered += 1;
        } catch {
          c.failed += 1;
        }
      }
      c.delivered = delivered;
      if ((c.status as string) !== 'stopped') c.status = 'completed';
    });
  }

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    if (!dto.message) throw new AppError('CAMPAIGN_BAD_MESSAGE', 'Message is required', 400);
    if (!dto.mobiles?.length) throw new AppError('CAMPAIGN_NO_MOBILES', 'At least one mobile is required', 400);
    // Debit 1 credit per mobile (mock pricing). TODO: real rate-card via Prisma.
    await this.wallet.debit(dto.ownerId, dto.mobiles.length, 'campaign', { refId: `campaign_pending` });
    const c: Campaign = {
      id: `cmp_${Date.now()}`,
      ownerId: dto.ownerId,
      senderId: dto.senderId,
      message: dto.message,
      mobiles: dto.mobiles,
      status: 'queued',
      total: dto.mobiles.length,
      delivered: 0,
      failed: 0,
      createdAt: new Date().toISOString(),
    };
    const { jobId } = await this.queue.add('sms-send', { campaignId: c.id }, 50);
    c.jobId = jobId;
    this.campaigns.unshift(c);
    return c;
  }

  list(ownerId?: string): Campaign[] {
    if (!ownerId) return this.campaigns;
    return this.campaigns.filter((c) => c.ownerId === ownerId);
  }

  get(id: string): Campaign {
    const c = this.campaigns.find((x) => x.id === id);
    if (!c) throw new AppError('CAMPAIGN_NOT_FOUND', `Campaign ${id} not found`, 404);
    return c;
  }

  async repush(id: string): Promise<Campaign> {
    const c = this.get(id);
    c.status = 'queued';
    c.delivered = 0;
    c.failed = 0;
    const { jobId } = await this.queue.add('sms-send', { campaignId: c.id }, 50);
    c.jobId = jobId;
    return c;
  }

  stop(id: string): Campaign {
    const c = this.get(id);
    c.status = 'stopped';
    return c;
  }
}
