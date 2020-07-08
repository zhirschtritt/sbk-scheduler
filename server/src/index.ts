import {FeathersApplication} from './app';

// process.on('unhandledRejection', (reason, p) => logger.error('Unhandled Rejection at: Promise ', p, reason));

function main() {
  const server = new FeathersApplication();
  server.start();
}

main();
