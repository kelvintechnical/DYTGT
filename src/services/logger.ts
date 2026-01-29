/**
 * Logging service for observability.
 * TODO: Integrate Azure Application Insights in production.
 * TODO: Integrate Sentry for error tracking.
 * TODO: Integrate LogRocket for session replay.
 */

export interface ILogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
}

const ANSI = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
};

function formatTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: string, message: string, color: string): string {
  const ts = formatTimestamp();
  return `${ANSI.dim}${ts}${ANSI.reset} ${color}[${level}]${ANSI.reset} ${message}`;
}

export class ConsoleLogger implements ILogger {
  private isDev = __DEV__;

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDev) {
      const out = formatMessage('DEBUG', message, ANSI.cyan);
      console.log(out, context ?? '');
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (this.isDev) {
      const out = formatMessage('INFO', message, ANSI.green);
      console.log(out, context ?? '');
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.isDev) {
      const out = formatMessage('WARN', message, ANSI.yellow);
      console.warn(out, context ?? '');
    } else {
      console.warn(formatMessage('WARN', message, ANSI.yellow), context ?? '');
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const out = formatMessage('ERROR', message, ANSI.red);
    if (this.isDev) {
      console.error(out, error ?? '', context ?? '');
    } else {
      console.error(out, error?.message ?? '', context ?? '');
    }
  }
}

export const logger = new ConsoleLogger();
