import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({ imports: [CampaignsModule], controllers: [DashboardController], providers: [DashboardService] })
export class DashboardModule {}
