import { Injectable, Logger } from '@nestjs/common';
import { getConfig } from '../common/config';

export type JobHandler = (payload: Record<string, unknown>) => Promise<void> | void;

/**
 * Queue abstraction: if QUEUE_DRIVER=redis && REDIS_URL set, use BullMQ;
 * otherwise fall back to in-memory setTimeout queue (default for local dev).
 * Never blocks boot when Redis/vendor is absent.
 */
@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private handlers = new Map<string, JobHandler>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private bullQueues = new Map<string, any>();
  private useRedis = false;

  constructor() {
    const cfg = getConfig();
    this.useRedis = cfg.queueDriver === 'redis' && !!cfg.redisUrl;
    if (this.useRedis) {
      this.logger.log(`Redis queue driver selected (REDIS_URL set). BullMQ queues will be created lazily.`);
    } else {
      this.logger.log(`Using in-memory queue driver (QUEUE_DRIVER=${cfg.queueDriver}).`);
    }
  }

  registerHandler(name: string, fn: JobHandler): void {
    this.handlers.set(name, fn);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async bullQueue(name: string): Promise<any> {
    let q = this.bullQueues.get(name);
    if (!q) {
      // Lazy import so memory mode never touches BullMQ/Redis.
      const { Queue } = await import('bullmq');
      q = new Queue(name, { connection: { url: getConfig().redisUrl } as unknown as never });
      this.bullQueues.set(name, q);
    }
    return q;
  }

  async add(name: string, payload: Record<string, unknown>, delayMs = 0): Promise<{ jobId: string; driver: string }> {
    const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    if (this.useRedis) {
      try {
        const q = await this.bullQueue(name);
        await q.add(name, { ...payload, jobId }, { delay: delayMs });
        this.logger.log(`[queue:redis] enqueued ${name} jobId=${jobId}`);
        return { jobId, driver: 'redis' };
      } catch (err) {
        this.logger.warn(`[queue:redis] enqueue failed, falling back to memory: ${(err as Error).message}`);
      }
    }
    this.logger.log(`[queue:memory] enqueued ${name} jobId=${jobId} delayMs=${delayMs}`);
    setTimeout(async () => {
      try {
        const fn = this.handlers.get(name);
        if (fn) await fn({ ...payload, jobId });
        this.logger.log(`[queue:memory] completed ${name} jobId=${jobId}`);
      } catch (err) {
        this.logger.error(`[queue:memory] failed ${name} jobId=${jobId}: ${(err as Error).message}`);
      }
    }, delayMs);
    return { jobId, driver: 'memory' };
  }
}
