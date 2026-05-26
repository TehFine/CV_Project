import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const user = request.user;
    const userId = user?._id?.toString() || user?.id?.toString() || 'anonymous';
    const userRole = user?.role || 'guest';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - now;
          this.logger.log(
            `${method} ${url} | ${response.statusCode} | ${duration}ms | 👤 ${userId.slice(-6)} 🎭 ${userRole}`,
          );
        },
        error: (err) => {
          const duration = Date.now() - now;
          const status = err.status || 500;
          this.logger.error(
            `${method} ${url} | ${status} | ${duration}ms | 👤 ${userId.slice(-6)} 🎭 ${userRole} | ❌ ${err.message}`,
            err.stack,
          );
        },
      }),
    );
  }
}
