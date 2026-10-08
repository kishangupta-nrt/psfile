/**
 * Standalone worker entry (`npm run worker` -> node dist/queue/worker).
 * Processes sms-send / voice / wa jobs in mock mode using the mock providers.
 * In redis mode it would attach BullMQ Workers; in memory mode it just logs
 * readiness (QueueService inside the API process already handles jobs).
 *
 * TODO: when REDIS_URL is live, create BullMQ Worker instances here per queue.
 */
import { MockSmsProvider } from '../providers/mock-sms.provider';
import { MockWhatsappProvider } from '../providers/mock-whatsapp.provider';
import { MockVoiceProvider } from '../providers/mock-voice.provider';

async function main(): Promise<void> {
  const sms = new MockSmsProvider();
  const wa = new MockWhatsappProvider();
  const voice = new MockVoiceProvider();

  const driver = (process.env['QUEUE_DRIVER'] || (process.env['REDIS_URL'] ? 'redis' : 'memory')).toLowerCase();
  // eslint-disable-next-line no-console
  console.log(`[worker] starting in mock mode driver=${driver}`);

  // Demonstrate mock processing path (no network).
  if (process.env['WORKER_DEMO'] === '1') {
    await sms.send('9999999999', 'worker boot self-test', { campaignId: 'boot' });
    await wa.sendText('9999999999', 'worker boot self-test');
    await voice.status('boot');
    // eslint-disable-next-line no-console
    console.log('[worker] demo jobs processed (mock).');
  }

  if (driver === 'redis' && process.env['REDIS_URL']) {
    // TODO: wire BullMQ Workers:
    //   new Worker('sms-send', async job => sms.send(...job.data), { connection })
    //   new Worker('wa-send', ...), new Worker('voice-send', ...)
    // eslint-disable-next-line no-console
    console.log('[worker] TODO: BullMQ Worker wiring pending — running idle (mock mode).');
  } else {
    // eslint-disable-next-line no-console
    console.log('[worker] in-memory mode: jobs are processed inside the API process. Worker idle.');
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[worker] fatal', err);
  process.exit(1);
});
