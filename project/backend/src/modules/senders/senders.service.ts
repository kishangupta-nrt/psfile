import { Injectable } from '@nestjs/common';
import { AppError } from '../../common/errors';

export interface SenderEntry {
  id: string;
  userId: string;
  sender: string;
  status: string;
  createdAt: string;
}

// TODO: swap with Prisma SenderId model when DB is up.
@Injectable()
export class SendersService {
  private senders: SenderEntry[] = [
    { id: 's_demo', userId: 'u_customer', sender: 'NRTINF', status: 'approved', createdAt: new Date().toISOString() },
  ];

  list(userId?: string): SenderEntry[] {
    if (!userId) return this.senders;
    return this.senders.filter((s) => s.userId === userId);
  }

  create(userId: string, sender: string): SenderEntry {
    const s: SenderEntry = { id: `s_${Date.now()}`, userId, sender: sender.toUpperCase().slice(0, 11), status: 'pending', createdAt: new Date().toISOString() };
    this.senders.push(s);
    return s;
  }

  assign(id: string, userId: string): SenderEntry {
    const s = this.senders.find((x) => x.id === id);
    if (!s) throw new AppError('SENDER_NOT_FOUND', `Sender ${id} not found`, 404);
    s.userId = userId;
    s.status = 'approved';
    return s;
  }

  remove(id: string): { ok: boolean } {
    const i = this.senders.findIndex((x) => x.id === id);
    if (i < 0) throw new AppError('SENDER_NOT_FOUND', `Sender ${id} not found`, 404);
    this.senders.splice(i, 1);
    return { ok: true };
  }
}
