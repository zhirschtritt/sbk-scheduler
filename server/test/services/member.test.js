const assert = require('assert');
const app = require('../../src/app');

describe('\'staffMember\' service', () => {
  it('registered the service', () => {
    const service = app.service('staffMembers');

    assert.ok(service, 'Registered the service');
  });
});
