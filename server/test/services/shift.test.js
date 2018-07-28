const assert = require('assert');
const app = require('../../src/app');

describe('\'shift\' service', () => {
  it('registered the service', () => {
    const service = app.service('shifts');

    assert.ok(service, 'Registered the service');
  });
});
