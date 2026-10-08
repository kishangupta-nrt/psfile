import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('kannel-status')
  kannelStatus() {
    return this.admin.kannelStatus();
  }

  @Post('server-commands')
  runCommand(@Body() b: { cmd: string; args?: Record<string, unknown> }) {
    return this.admin.runCommand(b.cmd, b.args ?? {});
  }

  @Post('manage-campaign')
  manageCampaign(@Body() b: { action: string; campaignId: string }) {
    return this.admin.manageCampaign(b.action, b.campaignId);
  }

  @Get('reports/user-wise')
  userWise() {
    return { data: this.admin.userWiseReport() };
  }
}
