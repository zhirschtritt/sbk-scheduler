import pino from 'pino';

export const logger = pino({
  level: 'debug',
  prettyPrint: true,
});

export type MinimalLogger = Pick<pino.Logger, 'info' | 'debug' | 'error' | 'warn'>;

export type LoggerFactory = (module: string) => pino.Logger;

export function loggerFactory(module: string) {
  return logger.child({module});
}
