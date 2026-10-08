import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';

@ApiTags('api-keys')
@Controller('api-keys')
export class ApiKeysController {
  constructor(private keys: ApiKeysService) {}

  @Get()
  list(@Query('userId') userId?: string) {
    return { data: this.keys.list(userId) };
  }

  @Post()
  create(@Body() b: { userId: string; ips?: string[] }) {
    return this.keys.create(b.userId, b.ips ?? []);
  }

  @Post(':id/rotate')
  rotate(@Param('id') id: string) {
    return this.keys.rotate(id);
  }

  @Get(':id/check-ip')
  checkIp(@Param('id') id: string, @Query('ip') ip = '') {
    return this.keys.checkIp(id, ip);
  }
}
