import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  private logLevel: LogLevel;
  private logDir: string;
  private errorStream?: NodeJS.WritableStream;
  private infoStream?: NodeJS.WritableStream;

  constructor() {
    this.logLevel = this.getLogLevel();
    this.logDir = join(process.cwd(), 'logs');
    this.initializeLogStreams();
  }

  private getLogLevel(): LogLevel {
    const level = process.env.LOG_LEVEL?.toLowerCase() || 'info';
    switch (level) {
      case 'error': return LogLevel.ERROR;
      case 'warn': return LogLevel.WARN;
      case 'info': return LogLevel.INFO;
      case 'debug': return LogLevel.DEBUG;
      default: return LogLevel.INFO;
    }
  }

  private initializeLogStreams(): void {
    if (process.env.NODE_ENV !== 'test') {
      try {
        if (!existsSync(this.logDir)) {
          mkdirSync(this.logDir, { recursive: true });
        }

        const today = new Date().toISOString().split('T')[0];
        
        this.errorStream = createWriteStream(
          join(this.logDir, `error-${today}.log`),
          { flags: 'a' }
        );
        
        this.infoStream = createWriteStream(
          join(this.logDir, `combined-${today}.log`),
          { flags: 'a' }
        );
      } catch (error) {
        console.error('Failed to initialize log streams:', error);
      }
    }
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  private writeToFile(stream: NodeJS.WritableStream | undefined, message: string): void {
    if (stream && process.env.NODE_ENV !== 'test') {
      stream.write(message + '\n');
    }
  }

  error(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.ERROR) {
      const formattedMessage = this.formatMessage('error', message, meta);
      console.error(formattedMessage);
      this.writeToFile(this.errorStream, formattedMessage);
      this.writeToFile(this.infoStream, formattedMessage);
    }
  }

  warn(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.WARN) {
      const formattedMessage = this.formatMessage('warn', message, meta);
      console.warn(formattedMessage);
      this.writeToFile(this.infoStream, formattedMessage);
    }
  }

  info(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.INFO) {
      const formattedMessage = this.formatMessage('info', message, meta);
      console.log(formattedMessage);
      this.writeToFile(this.infoStream, formattedMessage);
    }
  }

  debug(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.DEBUG) {
      const formattedMessage = this.formatMessage('debug', message, meta);
      console.log(formattedMessage);
      this.writeToFile(this.infoStream, formattedMessage);
    }
  }

  // HTTP request logging
  http(method: string, url: string, statusCode: number, responseTime: number, userAgent?: string): void {
    const message = `${method} ${url} ${statusCode} ${responseTime}ms`;
    const meta = userAgent ? { userAgent } : undefined;
    this.info(message, meta);
  }

  // Database operation logging
  db(operation: string, collection: string, duration: number, error?: Error): void {
    if (error) {
      this.error(`DB ${operation} failed on ${collection}`, { duration, error: error.message });
    } else {
      this.debug(`DB ${operation} on ${collection} completed in ${duration}ms`);
    }
  }

  // Authentication logging
  auth(event: string, userId?: string, ip?: string, userAgent?: string): void {
    const message = `Auth: ${event}`;
    const meta = { userId, ip, userAgent };
    this.info(message, meta);
  }

  // Performance logging
  performance(operation: string, duration: number, metadata?: any): void {
    const message = `Performance: ${operation} took ${duration}ms`;
    this.debug(message, metadata);
  }
}

export const logger = new Logger();
