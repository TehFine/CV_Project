import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const user = (request as any).user;
    const userId = user?._id?.toString() || user?.id || 'anonymous';
    const userEmail = user?.email || '-';
    const userRole = user?.role || 'guest';

    // Determine HTTP status and error message
    let status: number;
    let message: string | string[];
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
      stack = exception.stack;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      stack = exception.stack;
      // Log the actual error details for non-HTTP exceptions
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    // Build detailed error log
    const errorLog =
      `[${request.method}] ${request.originalUrl} | ` +
      `User: ${userEmail} (${userId}, ${userRole}) | ` +
      `Status: ${status} | ` +
      `Error: ${message}`;

    if (status >= 500) {
      this.logger.error(errorLog);
      if (stack) this.logger.debug(`Stack:\n${stack}`);
    } else if (status >= 400) {
      this.logger.warn(errorLog);
    }

    // Send consistent error response (hide internal details in production)
    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message : [message],
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    });
  }
}
