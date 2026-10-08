import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY_KEY, AbilityRequirement } from './abilities.decorator';

interface Ability {
  action: string;
  resource: string;
}

/**
 * CASL-style guard — checks @CheckAbility({action,resource}) against req.user.abilities.
 * No metadata => pass. `manage/all` is a super-ability wildcard.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<AbilityRequirement>(CHECK_ABILITY_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required) return true;

    const req = ctx.switchToHttp().getRequest();
    const abilities: Ability[] = req.user?.abilities ?? [];
    const ok = abilities.some(
      (a) =>
        (a.action === required.action && a.resource === required.resource) ||
        (a.action === 'manage' && a.resource === 'all') ||
        (a.action === required.action && a.resource === 'all') ||
        (a.action === 'dashboard' && required.resource === 'all'),
    );
    if (!ok) throw new ForbiddenException(`Forbidden: need ${required.action} on ${required.resource}`);
    return true;
  }
}
