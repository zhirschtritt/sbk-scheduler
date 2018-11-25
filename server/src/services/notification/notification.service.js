// Initializes the `notifications` service on path `/notifications`
const createService = require('./notification.class.js');
const hooks = require('./notification.hooks');

module.exports = function (app) {
  
  const mailer = app.get('mailer');
  const shifts = app.service('shifts');
  const staffMembers = app.service('staffMembers');

  const options = {
    mailer,
    shifts,
    staffMembers
  };

  const notifications = createService(options);
  
  notifications.docs = {
    create: {},
    definitions: {
      notifications: require('./notification.schema')
    }
  };

  app.use('/notifications', notifications);

  const service = app.service('notifications');

  service.hooks(hooks);
};
