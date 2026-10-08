import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { paginate, parsePagination } from '../../common/pagination';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  list(@Query() q: Record<string, unknown>) {
    const { page, perPage } = parsePagination(q);
    const ownerId = typeof q['ownerId'] === 'string' ? (q['ownerId'] as string) : undefined;
    // TODO: enforce ownerId scoping from req.user when JwtGuard is global.
    return paginate(this.users.list(ownerId), page, perPage);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.users.get(id);
  }

  @Post()
  create(@Body() b: { email: string; name?: string; phone?: string; password?: string; role?: 'super_admin' | 'reseller' | 'customer' | 'api_user'; ownerId?: string }) {
    return this.users.create(b);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() b: Record<string, unknown>) {
    return this.users.update(id, b);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}
