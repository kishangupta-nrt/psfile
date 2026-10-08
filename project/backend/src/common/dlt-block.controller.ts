import { Controller, All, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from './auth/abilities.decorator';

// DLT is out of scope — explicit 410 block (see PRODUCT_SPECIFICATION.md)
@Controller()
export class DltGuardController {
  @Public()
  @All(['dlt/*', 'dlt-templates*', 'dlt-template-group*', 'template-group-list', 'template-group*', 'dlt-template-list', 'dlt-template*', 'report-by-template-group*', 'summary-report-by-template-group*'])
  blocked(@Res() res: Response) {
    return res.status(410).json({ code: 'DLT_DISABLED', message: 'DLT excluded from this rebuild' });
  }
}
