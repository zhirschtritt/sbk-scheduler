const assert = require('assert');
const app = require('../../src/app');

describe('\'term\' service', () => {
  it('registered the service', () => {
    const service = app.service('terms');

    assert.ok(service, 'Registered the service');
  });
});
