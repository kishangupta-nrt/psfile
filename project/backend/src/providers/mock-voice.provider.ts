import { Injectable, Logger } from '@nestjs/common';
import { VoiceProvider, VoiceUploadResult } from './voice-provider.interface';

/**
 * Mock voice provider — no network, returns mock-* ids.
 * TODO: add RealVoiceProvider reading VOICE_BASE_URL / VOICE_API_KEY from env.
 */
@Injectable()
export class MockVoiceProvider implements VoiceProvider {
  private readonly logger = new Logger(MockVoiceProvider.name);

  async upload(fileName: string, sizeBytes = 0): Promise<VoiceUploadResult> {
    const fileId = `mock-voice-file-${Date.now()}`;
    this.logger.log(`[mock-voice] upload fileName=${fileName} size=${sizeBytes} fileId=${fileId}`);
    return { fileId, durationSec: 30 };
  }

  async process(fileId: string, opts: Record<string, unknown> = {}): Promise<{ jobId: string; status: string }> {
    const jobId = `mock-voice-job-${Date.now()}`;
    this.logger.log(`[mock-voice] process fileId=${fileId} opts=${JSON.stringify(opts)}`);
    return { jobId, status: 'processing' };
  }

  async send(toList: string[], fileId: string, opts: { campaignId?: string } = {}): Promise<{ batchId: string; queued: number }> {
    const batchId = `mock-voice-batch-${Date.now()}`;
    this.logger.log(`[mock-voice] send count=${toList.length} fileId=${fileId} campaign=${opts.campaignId ?? '-'}`);
    return { batchId, queued: toList.length };
  }

  async status(campaignId: string): Promise<{ campaignId: string; status: string; total: number; done: number }> {
    return { campaignId, status: 'sending', total: 100, done: 42 };
  }
}
