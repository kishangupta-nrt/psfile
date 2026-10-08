import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private contacts: ContactsService) {}

  @Get('groups')
  groups(@Query('ownerId') ownerId?: string) {
    return this.contacts.listGroups(ownerId);
  }

  @Post('groups')
  createGroup(@Body() b: { ownerId: string; name: string }) {
    return this.contacts.createGroup(b.ownerId, b.name);
  }

  @Get('groups/:id/numbers')
  numbers(@Param('id') id: string) {
    return this.contacts.listNumbers(id);
  }

  @Post('groups/:id/numbers')
  addNumber(@Param('id') id: string, @Body() b: { mobile: string; name?: string }) {
    return this.contacts.addNumber(id, b.mobile, b.name);
  }

  @Post('groups/:id/import')
  importNumbers(@Param('id') id: string, @Body() b: { csv: string }) {
    return this.contacts.importStub(id, b.csv ?? '');
  }
}
