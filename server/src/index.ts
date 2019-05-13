import {FeathersApplication} from './app';
import {loggerFactory} from './logger';
const logger = loggerFactory('main');

process.on('unhandledRejection', (reason, p) => logger.error('Unhandled Rejection at: Promise ', p, reason));

async function main() {
  const server = new FeathersApplication();
  await server.boot();
  server.start();
}

main();
