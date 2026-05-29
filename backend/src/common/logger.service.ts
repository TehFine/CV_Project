import {
  Injectable,
  Logger as NestLogger,
  LoggerService as NestLoggerService,
} from '@nestjs/common';

export type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'verbose';

export interface LogMetadata {
  userId?: string;
  userRole?: string;
  email?: string;
  action?: string;
  duration?: number;
  [key: string]: any;
}

@Injectable()
export class AppLogger implements NestLoggerService {
  private readonly logger: NestLogger;

  constructor(context: string) {
    this.logger = new NestLogger(context);
  }

  static forContext(context: string): AppLogger {
    return new AppLogger(context);
  }

  private formatMessage(message: string, metadata?: LogMetadata): string {
    if (!metadata) return message;

    const parts: string[] = [message];
    const { userId, userRole, email, action, duration, ...rest } = metadata;

    if (userId) parts.push(`👤 ${String(userId).slice(-6)}`);
    if (userRole) parts.push(`🎭 ${userRole}`);
    if (email) parts.push(`📧 ${email}`);
    if (action) parts.push(`⚡ ${action}`);
    if (duration !== undefined) parts.push(`⏱ ${duration}ms`);
    if (Object.keys(rest).length > 0) {
      const extra = Object.entries(rest)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(
          ([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`,
        )
        .join(' ');
      if (extra) parts.push(`📎 ${extra}`);
    }

    return parts.join(' | ');
  }

  log(message: string, metadata?: LogMetadata) {
    this.logger.log(this.formatMessage(message, metadata));
  }

  warn(message: string, metadata?: LogMetadata) {
    this.logger.warn(this.formatMessage(message, metadata));
  }

  error(message: string, trace?: string, metadata?: LogMetadata) {
    this.logger.error(this.formatMessage(message, metadata), trace);
  }

  debug(message: string, metadata?: LogMetadata) {
    this.logger.debug(this.formatMessage(message, metadata));
  }

  verbose(message: string, metadata?: LogMetadata) {
    this.logger.verbose(this.formatMessage(message, metadata));
  }

  // ─── Action shortcuts ───────────────────────────────────────────

  success(action: string, metadata?: LogMetadata) {
    this.log(`✅ ${action}`, metadata);
  }

  fail(action: string, metadata?: LogMetadata) {
    this.error(`❌ ${action}`, undefined, metadata);
  }
}
