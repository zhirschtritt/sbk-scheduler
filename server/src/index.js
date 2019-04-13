/* eslint-disable no-console */
import {get, listen} from './app';
import {error, info} from './logger';

const port = get('port');
const server = listen(port);

process.on('unhandledRejection', (reason, p) =>
  error('Unhandled Rejection at: Promise ', p, reason),
);

server.on('listening', () =>
  info('Feathers application started on http://%s:%d', get('host'), port),
);
