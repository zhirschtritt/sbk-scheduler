// Initializes the `notifications` service on path `/notifications`
import {NotificationService} from './NotificationService';
import {Application} from '@feathersjs/express';
const hooks = require('./notification.hooks');
import {NotificationHandlerFactory} from './Handlers/NotificationHandlerFactory';
const logger = require('../../logger');

module.exports = function(app: Application<any>) {
  const mailer = app.get('mailer');
  const shifts = app.service('shifts');
  const staffMembers = app.service('staffMembers');
  const smsClient = app.get('smsClient');

  const notificationHandlerFactory = new NotificationHandlerFactory(logger, shifts, staffMembers, mailer, smsClient);

  const notifications = new NotificationService(
    mailer,
    shifts as any,
    staffMembers,
    notificationHandlerFactory,
    logger,
    smsClient,
  );

  const swaggerDocs = {
    create: {},
    definitions: {
      notifications: require('./notification.schema'),
    },
  };

  app.use('/notifications', {...notifications, docs: swaggerDocs} as any);

  const service = app.service('notifications');

  service.hooks(hooks);
};
