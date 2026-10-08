import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { getConfig } from './common/config';
import { AppExceptionFilter } from './common/errors';
import { HealthController } from './health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ProvidersModule } from './providers/providers.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { BlacklistModule } from './modules/blacklist/blacklist.module';
import { SendersModule } from './modules/senders/senders.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { VoiceModule } from './modules/voice/voice.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { AdminModule } from './modules/admin/admin.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DltGuardController } from './common/dlt-block.controller';
import { JwtGuard } from './common/auth/jwt.guard';
import { RolesGuard } from './common/auth/roles.guard';

const cfg = getConfig();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: cfg.jwtSecret,
      signOptions: { expiresIn: '15m' },
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    ProvidersModule,
    AuthModule,
    UsersModule,
    WalletModule,
    ContactsModule,
    BlacklistModule,
    SendersModule,
    TemplatesModule,
    CampaignsModule,
    VoiceModule,
    WhatsappModule,
    NotificationsModule,
    ApiKeysModule,
    WebhooksModule,
    AdminModule,
    DashboardModule,
    ReportsModule,
  ],
  controllers: [HealthController, DltGuardController],
  providers: [
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
