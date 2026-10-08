import { Injectable } from '@nestjs/common';
import { AppError } from '../../common/errors';

export interface NotificationTemplate {
  id: string;
  name: string;
  body: string;
  lang: string;
  createdBy?: string;
}

// TODO: swap with Prisma NotificationTemplate model when DB is up.
@Injectable()
export class TemplatesService {
  private templates: NotificationTemplate[] = [
    { id: 't_demo', name: 'otp', body: 'Your OTP is {#var#}.', lang: 'en', createdBy: 'u_admin' },
  ];

  list(): NotificationTemplate[] {
    return this.templates;
  }

  get(id: string): NotificationTemplate {
    const t = this.templates.find((x) => x.id === id);
    if (!t) throw new AppError('TEMPLATE_NOT_FOUND', `Template ${id} not found`, 404);
    return t;
  }

  create(body: Omit<NotificationTemplate, 'id'>): NotificationTemplate {
    const t: NotificationTemplate = { ...body, id: `t_${Date.now()}` };
    this.templates.push(t);
    return t;
  }

  update(id: string, body: Partial<NotificationTemplate>): NotificationTemplate {
    const t = this.get(id);
    Object.assign(t, body, { id: t.id });
    return t;
  }

  remove(id: string): { ok: boolean } {
    const i = this.templates.findIndex((x) => x.id === id);
    if (i < 0) throw new AppError('TEMPLATE_NOT_FOUND', `Template ${id} not found`, 404);
    this.templates.splice(i, 1);
    return { ok: true };
  }
}
