// Initializes the `member` service on path `/members`
const createService = require('./member.class.js');
const hooks = require('./member.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/members', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/members');

  service.hooks(hooks);
};
