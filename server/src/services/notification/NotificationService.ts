import {NotificationHandlerFactory} from './Handlers';
import {Notification} from './notification.interfaces';
import {MinimalLogger} from '../../twilioSMSClient/Interfaces';
import {isNotification} from './notification.guards';

export class NotificationService {
  constructor(
    private readonly notificationHandlerFactory: NotificationHandlerFactory,
    private readonly logger: MinimalLogger,
  ) {}

  async create(notification: Notification) {
    if (!isNotification(notification)) {
      this.logger.error({notification}, 'Unknown notification type');
      throw new Error(`Unknown notification type received`);
    }

    const notificationHandler = await this.notificationHandlerFactory.manufacture(notification.notificationType);

    try {
      await notificationHandler.handle(notification);
      // feathers plugin requires a unique id be returned to update local store
      return {id: +new Date()};
    } catch (err) {
      this.logger.error({err}, 'Error processing notification');
      throw err;
    }
  }
}
