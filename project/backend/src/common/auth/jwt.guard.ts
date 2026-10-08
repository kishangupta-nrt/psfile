import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './abilities.decorator';

/**
 * Bearer guard — verifies JWT with JwtService and attaches req.user.
 * Routes marked @Public() bypass verification.
 */
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const header: string = req.headers?.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Missing bearer token');

    try {
      const payload = await this.jwt.verifyAsync(token);
      // Normalise: services expect { sub/userId, email, role, abilities }.
      req.user = {
        userId: payload.sub ?? payload.userId ?? payload.email,
        sub: payload.sub,
        email: payload.email,
        role: payload.role ?? 'customer',
        abilities: payload.abilities ?? [{ action: 'dashboard', resource: 'all' }],
        ...payload,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
