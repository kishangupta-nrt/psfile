import { Injectable } from '@nestjs/common';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  readAt?: string;
  createdAt: string;
}

// TODO: swap with Prisma Notification model when DB is up.
@Injectable()
export class NotificationsService {
  private items: NotificationItem[] = [
    { id: 'n_1', userId: 'u_customer', title: 'Welcome', body: 'Local dev wallet seeded with 1000 credits.', createdAt: new Date().toISOString() },
  ];

  list(userId?: string): NotificationItem[] {
    if (!userId) return this.items;
    return this.items.filter((n) => n.userId === userId);
  }

  create(userId: string, title: string, body: string): NotificationItem {
    const n: NotificationItem = { id: `n_${Date.now()}`, userId, title, body, createdAt: new Date().toISOString() };
    this.items.unshift(n);
    return n;
  }

  markRead(id: string): NotificationItem | { ok: boolean } {
    const n = this.items.find((x) => x.id === id);
    if (!n) return { ok: false };
    n.readAt = new Date().toISOString();
    return n;
  }
}
