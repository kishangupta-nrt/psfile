import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { AppError } from '../../common/errors';

export interface ApiKeyEntry {
  id: string;
  userId: string;
  keyHash: string;
  keyPreview: string;
  ips: string[];
  enabled: boolean;
  lastUsed?: string;
}

// TODO: swap with Prisma ApiKey model when DB is up. Never store raw keys.
@Injectable()
export class ApiKeysService {
  private keys: ApiKeyEntry[] = [];
  // Only for immediate display after create/rotate in local dev (do not persist raw).
  private lastRaw = new Map<string, string>();

  list(userId?: string): ApiKeyEntry[] {
    if (!userId) return this.keys;
    return this.keys.filter((k) => k.userId === userId);
  }

  create(userId: string, ips: string[] = []): ApiKeyEntry & { key: string } {
    const raw = `nrtsms_${randomBytes(18).toString('hex')}`;
    const keyHash = createHash('sha256').update(raw).digest('hex');
    const entry: ApiKeyEntry = {
      id: `ak_${Date.now()}`,
      userId,
      keyHash,
      keyPreview: `${raw.slice(0, 10)}…`,
      ips,
      enabled: true,
    };
    this.keys.unshift(entry);
    this.lastRaw.set(entry.id, raw);
    return { ...entry, key: raw };
  }

  rotate(id: string): ApiKeyEntry & { key: string } {
    const k = this.keys.find((x) => x.id === id);
    if (!k) throw new AppError('API_KEY_NOT_FOUND', `Key ${id} not found`, 404);
    const raw = `nrtsms_${randomBytes(18).toString('hex')}`;
    k.keyHash = createHash('sha256').update(raw).digest('hex');
    k.keyPreview = `${raw.slice(0, 10)}…`;
    this.lastRaw.set(k.id, raw);
    return { ...k, key: raw };
  }

  // Stub: checks request IP against the key's whitelist. TODO: call from an ApiKeyGuard.
  checkIp(id: string, ip: string): { ok: boolean; allowed: boolean } {
    const k = this.keys.find((x) => x.id === id);
    if (!k) throw new AppError('API_KEY_NOT_FOUND', `Key ${id} not found`, 404);
    if (!k.ips?.length) return { ok: true, allowed: true };
    return { ok: true, allowed: k.ips.includes(ip) };
  }
}
