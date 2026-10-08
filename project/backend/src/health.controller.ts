import { Controller, Get } from '@nestjs/common';
import { Public } from './common/auth/abilities.decorator';
@Controller('health')
export class HealthController {
  @Public() @Get() ok() { return { ok: true, service: 'nrtsms-backend', dlt: 'disabled' }; }
}
