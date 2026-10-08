import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VoiceService } from './voice.service';

@ApiTags('voice')
@Controller('voice')
export class VoiceController {
  constructor(private voice: VoiceService) {}

  @Post('uploads')
  upload(@Body() b: { fileName: string; sizeBytes?: number }) {
    return this.voice.upload(b.fileName ?? 'audio.mp3', Number(b.sizeBytes ?? 0));
  }

  @Post('process')
  process(@Body() b: { fileId: string; opts?: Record<string, unknown> }) {
    return this.voice.process(b.fileId, b.opts ?? {});
  }

  @Post('campaigns/send')
  send(@Body() b: { ownerId: string; fileId: string; mobiles: string[] }) {
    return this.voice.send(b.ownerId ?? 'u_customer', b.fileId, b.mobiles ?? []);
  }

  @Get('campaigns')
  list() {
    return { data: this.voice.list() };
  }

  @Post('campaigns/:id/stop')
  stop(@Param('id') id: string) {
    return this.voice.stop(id);
  }
}
