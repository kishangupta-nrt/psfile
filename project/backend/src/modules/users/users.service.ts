import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppError } from '../../common/errors';

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'super_admin' | 'reseller' | 'customer' | 'api_user';
  ownerId?: string;
  status: string;
  abilities: Array<{ action: string; resource: string }>;
  /** bcrypt hash — never serialized to clients. */
  passwordHash?: string;
}

function seedHash(envName: string, fallback: string): string {
  const plain = process.env[envName] || fallback;
  return bcrypt.hashSync(plain, 12);
}

// TODO: swap in-memory store with Prisma User model when DATABASE_URL is live.
@Injectable()
export class UsersService {
  private users: DemoUser[] = [
    { id: 'u_admin', email: process.env.ADMIN_EMAIL || 'admin@local.dev', name: 'Admin', role: 'super_admin', status: 'active', abilities: [{ action: 'manage', resource: 'all' }], passwordHash: seedHash('ADMIN_PASSWORD', 'Admin@123') },
    { id: 'u_reseller', email: 'reseller@local.dev', name: 'Reseller', role: 'reseller', ownerId: 'u_admin', status: 'active', abilities: [{ action: 'manage', resource: 'customers' }], passwordHash: seedHash('RESELLER_PASSWORD', 'Reseller@123') },
    { id: 'u_customer', email: 'customer@local.dev', name: 'Customer', role: 'customer', ownerId: 'u_reseller', status: 'active', abilities: [{ action: 'dashboard', resource: 'all' }], passwordHash: seedHash('CUSTOMER_PASSWORD', 'Customer@123') },
  ];

  /** Strip passwordHash before returning to controllers. */
  private safe(u: DemoUser): DemoUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = u;
    return rest as DemoUser;
  }

  list(ownerId?: string): DemoUser[] {
    const rows = !ownerId ? this.users : this.users.filter((u) => u.id === ownerId || u.ownerId === ownerId);
    return rows.map((u) => this.safe(u));
  }

  get(id: string): DemoUser {
    const u = this.users.find((x) => x.id === id);
    if (!u) throw new AppError('USER_NOT_FOUND', `User ${id} not found`, 404);
    return this.safe(u);
  }

  /** Internal lookup including hash — auth only, never expose via controller. */
  findByEmailWithHash(email: string): DemoUser | undefined {
    return this.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
  }

  async setPasswordByEmail(email: string, newPlainPassword: string): Promise<void> {
    const u = this.findByEmailWithHash(email);
    if (!u) throw new AppError('USER_NOT_FOUND', `User ${email} not found`, 404);
    u.passwordHash = await bcrypt.hash(newPlainPassword, 12);
  }

  create(body: Partial<DemoUser> & { email: string; password?: string }): DemoUser {
    if (this.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) {
      throw new AppError('USER_EXISTS', 'Email already exists', 409);
    }
    const u: DemoUser = {
      id: `u_${Date.now()}`,
      email: body.email,
      name: body.name ?? body.email,
      phone: body.phone,
      role: body.role ?? 'customer',
      ownerId: body.ownerId,
      status: 'active',
      abilities: body.abilities ?? [{ action: 'dashboard', resource: 'all' }],
      passwordHash: body.password ? bcrypt.hashSync(body.password, 12) : bcrypt.hashSync('ChangeMe@123', 12),
    };
    this.users.push(u);
    return this.safe(u);
  }

  update(id: string, body: Partial<DemoUser> & { password?: string }): DemoUser {
    const raw = this.users.find((x) => x.id === id);
    if (!raw) throw new AppError('USER_NOT_FOUND', `User ${id} not found`, 404);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, password, ...rest } = body as DemoUser & { password?: string };
    Object.assign(raw, rest, { id: raw.id });
    if (password) raw.passwordHash = bcrypt.hashSync(password, 12);
    return this.safe(raw);
  }

  remove(id: string): { ok: boolean } {
    const i = this.users.findIndex((x) => x.id === id);
    if (i < 0) throw new AppError('USER_NOT_FOUND', `User ${id} not found`, 404);
    this.users.splice(i, 1);
    return { ok: true };
  }
}
