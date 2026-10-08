import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private templates: TemplatesService) {}

  @Get()
  list() {
    return this.templates.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.templates.get(id);
  }

  @Post()
  create(@Body() b: { name: string; body: string; lang?: string; createdBy?: string }) {
    return this.templates.create({ name: b.name, body: b.body, lang: b.lang ?? 'en', createdBy: b.createdBy });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() b: Record<string, unknown>) {
    return this.templates.update(id, b);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templates.remove(id);
  }
}
