// Initializes the `shift` service on path `/shifts`
const createService = require('./shift.class.js');
const hooks = require('./shift.hooks');

module.exports = function (app) {
  
  const termLength = app.get('termLength');
  const paginate = app.get('paginate');
  const sheets = app.get('sheetsClient');

  const options = {
    paginate,
    termLength,
    sheets
  };

  // Initialize our service with any options it requires
  app.use('/shifts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('shifts');

  service.hooks(hooks);
};
