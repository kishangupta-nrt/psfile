import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private campaigns: CampaignsService) {}

  @Post()
  create(@Body() b: { ownerId: string; senderId?: string; message: string; mobiles: string[] }) {
    return this.campaigns.create({ ownerId: b.ownerId ?? 'u_customer', senderId: b.senderId, message: b.message, mobiles: b.mobiles ?? [] });
  }

  @Get()
  list(@Query('ownerId') ownerId?: string) {
    return { data: this.campaigns.list(ownerId) };
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.campaigns.get(id);
  }

  @Post(':id/repush')
  repush(@Param('id') id: string) {
    return this.campaigns.repush(id);
  }

  @Post(':id/stop')
  stop(@Param('id') id: string) {
    return this.campaigns.stop(id);
  }
}
