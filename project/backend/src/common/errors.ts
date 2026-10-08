import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorShape {
  code: string;
  message: string;
  details?: unknown;
}

// Domain error — service layer throws this; filter normalises the HTTP shape.
export class AppError extends HttpException {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, status = HttpStatus.BAD_REQUEST, details?: unknown) {
    super({ code, message, details }, status);
    this.code = code;
    this.details = details;
  }
}

/**
 * Global filter producing `{ code, message, details }`.
 * Register as APP_FILTER in AppModule (see app.module.ts).
 */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: ErrorShape = { code: 'INTERNAL_ERROR', message: 'Internal server error' };

    if (exception instanceof AppError) {
      status = exception.getStatus();
      const r = exception.getResponse() as ErrorShape;
      body = { code: r.code || 'APP_ERROR', message: r.message || 'Application error', details: r.details };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r = exception.getResponse() as string | Record<string, unknown>;
      if (typeof r === 'string') {
        body = { code: `HTTP_${status}`, message: r };
      } else {
        const msg = (r as Record<string, unknown>)['message'];
        body = {
          code: (r as Record<string, unknown>)['code'] as string || `HTTP_${status}`,
          message: Array.isArray(msg) ? msg.join('; ') : (msg as string) || exception.message,
          details: (r as Record<string, unknown>)['details'] ?? (r as Record<string, unknown>)['error'],
        };
      }
    } else if (exception instanceof Error) {
      body = { code: 'INTERNAL_ERROR', message: exception.message };
    }

    res.status(status).json(body);
  }
}
