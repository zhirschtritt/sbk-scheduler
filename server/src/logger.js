import pino from 'pino';

const logger = pino({
  level: 'debug',
  prettyPrint: true,
});

export default logger;
module.exports = logger;
