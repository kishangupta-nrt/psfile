import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/auth/abilities.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Public() @Throttle({ default: { limit: 5, ttl: 60000 } }) @Post('login') login(@Body() b: { email: string; password: string }) { return this.auth.login(b.email, b.password); }
  @Post('change-password') changePassword(@Body() b: { email: string; currentPassword: string; newPassword: string }) { return this.auth.changePassword(b.email, b.currentPassword, b.newPassword); }
  @Public() @Post('refresh') refresh(@Body() b: { sub: string }) { return this.auth.refresh(b.sub); }
  @Public() @Post('logout') logout() { return { ok: true }; }
}
