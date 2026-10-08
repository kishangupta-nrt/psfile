import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @Get('campaigns') campaigns(@Query() q: Record<string, unknown>) { return this.reports.campaignReport(q); }
  @Get('detailed') detailed() { return this.reports.detailed(); }
  @Get('delivery') delivery() { return this.reports.delivery(); }
}
