import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  list(@Query('userId') userId?: string) {
    return { data: this.notifications.list(userId) };
  }

  @Post()
  create(@Body() b: { userId: string; title: string; body: string }) {
    return this.notifications.create(b.userId, b.title, b.body);
  }

  @Post(':id/read')
  markRead(@Param('id') id: string) {
    return this.notifications.markRead(id);
  }
}
