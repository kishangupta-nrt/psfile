import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/auth/abilities.decorator';
import { WebhooksService } from './webhooks.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooks: WebhooksService) {}

  @Public()
  @Post('dlr/:vendor')
  ingest(@Param('vendor') vendor: string, @Body() body: Record<string, unknown>) {
    return this.webhooks.ingest(vendor, body ?? {});
  }

  @Get('dlr')
  list() {
    return { data: this.webhooks.list() };
  }
}
