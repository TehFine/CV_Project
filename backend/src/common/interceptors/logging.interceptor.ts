import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, originalUrl } = request;

    // Extract user info if authenticated
    const user = (request as any).user;
    const userId = user?._id?.toString() || user?.id || 'anonymous';
    const userRole = user?.role || 'guest';
    const userEmail = user?.email || '-';

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        const logMessage =
          `[${method}] ${originalUrl} | ` +
          `User: ${userEmail} (${userId}, ${userRole}) | ` +
          `Status: ${statusCode} | ` +
          `Duration: ${duration}ms`;

        this.logger.log(logMessage);
      }),
    );
  }
}
