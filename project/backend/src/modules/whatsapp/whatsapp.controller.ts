import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';

@ApiTags('whatsapp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private wa: WhatsappService) {}

  @Post('send')
  send(@Body() b: { to: string; body?: string; template?: string; params?: string[] }) {
    if (b.template) return this.wa.sendTemplate(b.to, b.template, b.params ?? []);
    return this.wa.sendText(b.to, b.body ?? '');
  }

  @Post('campaigns')
  createCampaign(@Body() b: { ownerId: string; template: string; mobiles: string[] }) {
    return this.wa.createCampaign(b.ownerId ?? 'u_customer', b.template, b.mobiles ?? []);
  }

  @Get('campaigns')
  listCampaigns() {
    return { data: this.wa.listCampaigns() };
  }

  @Get('templates')
  templates() {
    return this.wa.pullTemplates();
  }

  @Post('templates/pull')
  pull() {
    return this.wa.pullTemplates();
  }

  @Get('analytics')
  analytics() {
    return this.wa.analytics();
  }
}
