import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlacklistService } from './blacklist.service';

@ApiTags('blacklist')
@Controller('blacklist')
export class BlacklistController {
  constructor(private blacklist: BlacklistService) {}

  @Get()
  list() {
    return this.blacklist.list();
  }

  @Post()
  add(@Body() b: { mobile: string; reason?: string }) {
    return this.blacklist.add(b.mobile, b.reason);
  }

  @Delete(':mobile')
  remove(@Param('mobile') mobile: string) {
    return this.blacklist.delete(mobile);
  }

  @Post('import')
  importStub(@Body() b: { mobiles: string[]; reason?: string }) {
    return this.blacklist.importStub(b.mobiles ?? [], b.reason);
  }
}
