import { Injectable } from '@nestjs/common';
import { AppError } from '../../common/errors';

const ALLOWED_COMMANDS = new Set(['kannel-status', 'queue-depth', 'flush-queue', 'reload-templates']);

// TODO: back with real Kannel status (KANNEL_URL from env) + Prisma aggregates when live.
@Injectable()
export class AdminService {
  kannelStatus(): Record<string, unknown> {
    return {
      vendor: 'mock',
      uptime: '2h11m',
      smsc: [{ name: 'mock-smsc-1', status: 'online', queued: 0 }],
      note: 'Mock — wire KANNEL_URL from env for real status.',
    };
  }

  runCommand(cmd: string, args: Record<string, unknown> = {}): Record<string, unknown> {
    if (!ALLOWED_COMMANDS.has(cmd)) {
      throw new AppError('ADMIN_COMMAND_DENIED', `Command ${cmd} is not allowlisted`, 403, {
        allowed: [...ALLOWED_COMMANDS],
      });
    }
    return { ok: true, cmd, args, at: new Date().toISOString() };
  }

  manageCampaign(action: string, campaignId: string): Record<string, unknown> {
    if (!['stop', 'repush', 'pause'].includes(action)) {
      throw new AppError('ADMIN_BAD_ACTION', `Unknown manage-campaign action ${action}`, 400);
    }
    return { ok: true, action, campaignId };
  }

  userWiseReport(): Array<Record<string, unknown>> {
    return [
      { userId: 'u_reseller', campaigns: 3, creditsUsed: 1200 },
      { userId: 'u_customer', campaigns: 5, creditsUsed: 640 },
    ];
  }
}
