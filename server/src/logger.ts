import pino from 'pino';

export const logger = pino({
  level: 'debug',
  prettyPrint: true,
  timestamp: () => new Date().toISOString(),
});

export type MinimalLogger = Pick<pino.Logger, 'info' | 'debug' | 'error' | 'warn'>;

export type LoggerFactory = (module: string) => pino.Logger;

export function loggerFactory(module: string) {
  return logger.child({module});
}
