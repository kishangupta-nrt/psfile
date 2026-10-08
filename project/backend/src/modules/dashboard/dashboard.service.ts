import { Inject, Injectable } from '@nestjs/common';
import { WALLET_PROVIDER, WalletProvider } from '../../providers/wallet-provider.interface';
import { CampaignsService } from '../campaigns/campaigns.service';

// TODO: replace mock counts with Prisma aggregates when DB is up.
@Injectable()
export class DashboardService {
  constructor(
    @Inject(WALLET_PROVIDER) private wallet: WalletProvider,
    private campaigns: CampaignsService,
  ) {}

  async summary(userId = 'u_customer'): Promise<Record<string, unknown>> {
    const balance = await this.wallet.getBalance(userId);
    const txns = await this.wallet.listTxns(userId);
    const all = this.campaigns.list(userId);
    return {
      userId,
      wallet: balance,
      campaigns: {
        total: all.length,
        queued: all.filter((c) => c.status === 'queued').length,
        sending: all.filter((c) => c.status === 'sending').length,
        completed: all.filter((c) => c.status === 'completed').length,
      },
      recentTxns: txns.slice(0, 5),
      recentCampaigns: all.slice(0, 5),
    };
  }
}
