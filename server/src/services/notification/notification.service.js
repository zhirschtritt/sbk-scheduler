// Initializes the `notifications` service on path `/notifications`
const createService = require('./notification.class.js');
const hooks = require('./notification.hooks');

module.exports = function (app) {
  
  const mailer = app.get('mailer');
  const shifts = app.service('shifts');
  const members = app.service('members');

  const options = {
    mailer,
    shifts,
    members
  };

  // Initialize our service with any options it requires
  app.use('/notifications', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('notifications');

  service.hooks(hooks);
};
