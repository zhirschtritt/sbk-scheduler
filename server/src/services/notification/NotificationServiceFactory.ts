// Initializes the `notifications` service on path `/notifications`
import {NotificationService} from './NotificationService';
import {Application} from '@feathersjs/feathers';
const hooks = require('./notification.hooks');
import {NotificationHandlerFactory} from './Handlers';
import {CompositePublisherFactory} from './Publishers';
import {logger} from '../../logger';

export default function(app: Application<any>) {
  const mailer = app.get('mailer');
  const shifts = app.service('shifts') as any;
  const staffMembers = app.service('staffMembers') as any;
  const smsClient = app.get('smsClient');
  const staffEmail = app.get('staffEmail');

  const notificationHandlerFactory = new NotificationHandlerFactory(
    logger,
    shifts,
    staffMembers,
    new CompositePublisherFactory(mailer, smsClient, staffEmail),
  );

  const notifications = new NotificationService(staffMembers, shifts, notificationHandlerFactory, logger);

  (notifications as any).docs = {
    create: {},
    definitions: {
      notifications: require('./notification.schema'),
    },
  };

  app.use('/notifications', notifications);

  const service = app.service('notifications');

  service.hooks(hooks);
}
