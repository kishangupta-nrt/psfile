export const VOICE_PROVIDER = 'VOICE_PROVIDER';

export interface VoiceUploadResult {
  fileId: string;
  durationSec?: number;
}

export interface VoiceProvider {
  upload(fileName: string, sizeBytes?: number): Promise<VoiceUploadResult>;
  process(fileId: string, opts?: Record<string, unknown>): Promise<{ jobId: string; status: string }>;
  send(toList: string[], fileId: string, opts?: { campaignId?: string }): Promise<{ batchId: string; queued: number }>;
  status(campaignId: string): Promise<{ campaignId: string; status: string; total: number; done: number }>;
}
