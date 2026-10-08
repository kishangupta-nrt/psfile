import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

// In-memory users with bcrypt hashes (seeded from ADMIN_PASSWORD etc.).
// TODO: replace with Prisma User lookup when DATABASE_URL is live.
@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private users: UsersService) {}
  async login(email: string, password: string) {
    if (!email || !password) throw new UnauthorizedException('Invalid credentials');
    const found = this.users.findByEmailWithHash(email);
    if (!found) throw new UnauthorizedException('Invalid credentials');
    const ok = found.passwordHash ? await bcrypt.compare(password, found.passwordHash) : false;
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const sub = found.id;
    const access_token = await this.jwt.signAsync({ sub, email: found.email, role: found.role });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...user } = found;
    return { user, access_token, abilities: found.abilities };
  }
  async changePassword(email: string, currentPassword: string, newPassword: string) {
    if (!email || !currentPassword || !newPassword) throw new BadRequestException('email, currentPassword and newPassword are required');
    if (newPassword.length < 8) throw new BadRequestException('New password must be at least 8 characters');
    const found = this.users.findByEmailWithHash(email);
    if (!found) throw new UnauthorizedException('Invalid credentials');
    const ok = found.passwordHash ? await bcrypt.compare(currentPassword, found.passwordHash) : false;
    if (!ok) throw new UnauthorizedException('Current password is incorrect');
    await this.users.setPasswordByEmail(email, newPassword);
    return { ok: true };
  }
  async refresh(sub: string) {
    return { access_token: await this.jwt.signAsync({ sub }) };
  }
}
