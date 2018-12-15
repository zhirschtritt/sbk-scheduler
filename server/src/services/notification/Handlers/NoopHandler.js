class NoopHandler {
  constructor({log}) {
    this.log = log;
  }

  handle() {
    this.log.debug('Using Noop handler for unknown notification type');
    return Promise.resolve();
  }
}

module.exports = {
  NoopHandler
};