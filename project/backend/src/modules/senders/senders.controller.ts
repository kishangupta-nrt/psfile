import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendersService } from './senders.service';

@ApiTags('senders')
@Controller('senders')
export class SendersController {
  constructor(private senders: SendersService) {}

  @Get()
  list(@Query('userId') userId?: string) {
    return this.senders.list(userId);
  }

  @Post()
  create(@Body() b: { userId: string; sender: string }) {
    return this.senders.create(b.userId, b.sender);
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body() b: { userId: string }) {
    return this.senders.assign(id, b.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.senders.remove(id);
  }
}
