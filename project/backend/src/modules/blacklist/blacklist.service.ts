import { Injectable } from '@nestjs/common';

export interface BlacklistEntry {
  mobile: string;
  reason?: string;
  createdAt: string;
}

// TODO: swap with Prisma Blacklist model when DB is up.
@Injectable()
export class BlacklistService {
  private entries = new Map<string, BlacklistEntry>([
    ['7777777777', { mobile: '7777777777', reason: 'DND demo', createdAt: new Date().toISOString() }],
  ]);

  list(): BlacklistEntry[] {
    return [...this.entries.values()];
  }

  add(mobile: string, reason?: string): BlacklistEntry {
    const e: BlacklistEntry = { mobile, reason, createdAt: new Date().toISOString() };
    this.entries.set(mobile, e);
    return e;
  }

  delete(mobile: string): { ok: boolean } {
    this.entries.delete(mobile);
    return { ok: true };
  }

  importStub(mobiles: string[], reason?: string): { imported: number } {
    let imported = 0;
    for (const m of mobiles) {
      if (m?.trim()) {
        this.add(m.trim(), reason);
        imported += 1;
      }
    }
    return { imported };
  }

  isBlocked(mobile: string): boolean {
    return this.entries.has(mobile);
  }
}
