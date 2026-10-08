import { Global, Module } from '@nestjs/common';
import { getConfig } from '../common/config';
import { SMS_PROVIDER } from './sms-provider.interface';
import { MockSmsProvider } from './mock-sms.provider';
import { WHATSAPP_PROVIDER } from './whatsapp-provider.interface';
import { MockWhatsappProvider } from './mock-whatsapp.provider';
import { VOICE_PROVIDER } from './voice-provider.interface';
import { MockVoiceProvider } from './mock-voice.provider';
import { WALLET_PROVIDER } from './wallet-provider.interface';
import { LocalWalletProvider } from './local-wallet.provider';
import { QueueService } from '../queue/queue.service';

/**
 * Selects mock vs real providers via env PROVIDER_* (default mock).
 * Real providers are not implemented yet — env placeholders exist in .env.example
 * (SMS_VENDOR_* / WA_* / VOICE_*) for future wiring without hard-coded endpoints.
 */
@Global()
@Module({
  providers: [
    MockSmsProvider,
    MockWhatsappProvider,
    MockVoiceProvider,
    LocalWalletProvider,
    QueueService,
    {
      provide: SMS_PROVIDER,
      useFactory: () => {
        const kind = getConfig().providerSms;
        if (kind !== 'mock') {
          // TODO: return RealSmsProvider when vendor SDK is chosen.
          // eslint-disable-next-line no-console
          console.warn(`[providers] PROVIDER_SMS=${kind} requested but only mock is implemented; falling back to mock.`);
        }
        return new MockSmsProvider();
      },
    },
    {
      provide: WHATSAPP_PROVIDER,
      useFactory: () => {
        const kind = getConfig().providerWa;
        if (kind !== 'mock') {
          // TODO: return RealWhatsappProvider (WA_BASE_URL / WA_TOKEN from env).
          // eslint-disable-next-line no-console
          console.warn(`[providers] PROVIDER_WA=${kind} requested but only mock is implemented; falling back to mock.`);
        }
        return new MockWhatsappProvider();
      },
    },
    {
      provide: VOICE_PROVIDER,
      useFactory: () => {
        const kind = getConfig().providerVoice;
        if (kind !== 'mock') {
          // TODO: return RealVoiceProvider (VOICE_BASE_URL / VOICE_API_KEY from env).
          // eslint-disable-next-line no-console
          console.warn(`[providers] PROVIDER_VOICE=${kind} requested but only mock is implemented; falling back to mock.`);
        }
        return new MockVoiceProvider();
      },
    },
    {
      provide: WALLET_PROVIDER,
      useClass: LocalWalletProvider,
    },
  ],
  exports: [SMS_PROVIDER, WHATSAPP_PROVIDER, VOICE_PROVIDER, WALLET_PROVIDER, QueueService],
})
export class ProvidersModule {}
