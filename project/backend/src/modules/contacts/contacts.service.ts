import { Injectable } from '@nestjs/common';
import { AppError } from '../../common/errors';

export interface ContactGroup {
  id: string;
  ownerId: string;
  name: string;
}

export interface ContactEntry {
  id: string;
  groupId: string;
  mobile: string;
  name?: string;
  vars?: Record<string, string>;
}

// TODO: swap with Prisma ContactGroup + Contact models when DB is up.
@Injectable()
export class ContactsService {
  private groups: ContactGroup[] = [{ id: 'g_demo', ownerId: 'u_customer', name: 'Demo group' }];
  private contacts: ContactEntry[] = [
    { id: 'c_1', groupId: 'g_demo', mobile: '9999999999', name: 'Demo One' },
    { id: 'c_2', groupId: 'g_demo', mobile: '8888888888', name: 'Demo Two' },
  ];

  listGroups(ownerId?: string): ContactGroup[] {
    if (!ownerId) return this.groups;
    return this.groups.filter((g) => g.ownerId === ownerId);
  }

  createGroup(ownerId: string, name: string): ContactGroup {
    const g: ContactGroup = { id: `g_${Date.now()}`, ownerId, name };
    this.groups.push(g);
    return g;
  }

  listNumbers(groupId: string): ContactEntry[] {
    return this.contacts.filter((c) => c.groupId === groupId);
  }

  addNumber(groupId: string, mobile: string, name?: string): ContactEntry {
    if (!this.groups.some((g) => g.id === groupId)) throw new AppError('GROUP_NOT_FOUND', `Group ${groupId} not found`, 404);
    const c: ContactEntry = { id: `c_${Date.now()}`, groupId, mobile, name };
    this.contacts.push(c);
    return c;
  }

  // Stub: parses CSV text `mobile,name` per line. TODO: stream large files + Prisma bulk insert.
  importStub(groupId: string, csv: string): { imported: number } {
    const lines = csv.split('\n').map((l) => l.trim()).filter(Boolean);
    let imported = 0;
    for (const line of lines) {
      const [mobile, name] = line.split(',').map((s) => s?.trim());
      if (mobile) {
        this.contacts.push({ id: `c_${Date.now()}_${imported}`, groupId, mobile, name });
        imported += 1;
      }
    }
    return { imported };
  }
}
