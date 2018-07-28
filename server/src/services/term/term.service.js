// Initializes the `term` service on path `/terms`
const createService = require('./term.class.js');
const hooks = require('./term.hooks');

module.exports = function (app) {
  const termLength = app.get('termLength');
  const paginate = app.get('paginate');

  const sheets = app.get('sheetsClient');

  const options = {
    paginate,
    sheets,
    termLength
  };

  // Initialize our service with any options it requires
  app.use('/terms', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('terms');

  service.hooks(hooks);
};
