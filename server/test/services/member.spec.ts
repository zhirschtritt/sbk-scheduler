import {FeathersApplication} from '../../src/app';

describe("'member' service", function() {
  it('registered the service', async function() {
    const app = new FeathersApplication();
    await app.boot();
    const service = (app as any).service('members');

    expect(service).toBeTruthy();
  });
});
