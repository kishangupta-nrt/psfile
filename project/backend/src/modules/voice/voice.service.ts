import { Inject, Injectable } from '@nestjs/common';
import { VOICE_PROVIDER, VoiceProvider } from '../../providers/voice-provider.interface';
import { QueueService } from '../../queue/queue.service';
import { AppError } from '../../common/errors';

export interface VoiceCampaign {
  id: string;
  ownerId: string;
  fileId: string;
  mobiles: string[];
  status: 'queued' | 'sending' | 'stopped' | 'completed';
  queued: number;
  createdAt: string;
}

// TODO: swap with Prisma (VoiceFile + Campaign type=voice) when DB is up.
@Injectable()
export class VoiceService {
  private files = new Map<string, { fileName: string; sizeBytes: number; fileId: string }>();
  private campaigns: VoiceCampaign[] = [];

  constructor(
    @Inject(VOICE_PROVIDER) private voice: VoiceProvider,
    private queue: QueueService,
  ) {
    this.queue.registerHandler('voice-send', async (payload) => {
      const id = payload['campaignId'] as string;
      const c = this.campaigns.find((x) => x.id === id);
      if (!c || c.status === 'stopped') return;
      c.status = 'sending';
      await this.voice.send(c.mobiles, c.fileId, { campaignId: c.id });
      if ((c.status as string) !== 'stopped') c.status = 'completed';
    });
  }

  async upload(fileName: string, sizeBytes = 0): Promise<{ fileId: string; durationSec?: number }> {
    const r = await this.voice.upload(fileName, sizeBytes);
    this.files.set(r.fileId, { fileName, sizeBytes, fileId: r.fileId });
    return r;
  }

  process(fileId: string, opts: Record<string, unknown> = {}): Promise<{ jobId: string; status: string }> {
    if (!this.files.has(fileId)) throw new AppError('VOICE_FILE_NOT_FOUND', `File ${fileId} not found`, 404);
    return this.voice.process(fileId, opts);
  }

  async send(ownerId: string, fileId: string, mobiles: string[]): Promise<VoiceCampaign> {
    if (!this.files.has(fileId)) throw new AppError('VOICE_FILE_NOT_FOUND', `File ${fileId} not found`, 404);
    const c: VoiceCampaign = {
      id: `vcp_${Date.now()}`,
      ownerId,
      fileId,
      mobiles,
      status: 'queued',
      queued: mobiles.length,
      createdAt: new Date().toISOString(),
    };
    this.campaigns.unshift(c);
    await this.queue.add('voice-send', { campaignId: c.id }, 50);
    return c;
  }

  list(): VoiceCampaign[] {
    return this.campaigns;
  }

  stop(id: string): VoiceCampaign {
    const c = this.campaigns.find((x) => x.id === id);
    if (!c) throw new AppError('VOICE_CAMPAIGN_NOT_FOUND', `Voice campaign ${id} not found`, 404);
    c.status = 'stopped';
    return c;
  }
}
