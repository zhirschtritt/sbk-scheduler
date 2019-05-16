import pino from 'pino';

export const logger = pino({
  level: 'debug',
  prettyPrint: true,
});

export function loggerFactory(module: string) {
  return logger.child({module});
}
