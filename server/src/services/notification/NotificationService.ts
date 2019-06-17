import {NotificationHandlerFactory} from './Handlers';
import {isNotification} from './notification.interfaces';
import {MinimalLogger} from '../../twilioSMSClient/Interfaces';

export class NotificationService {
  constructor(
    private readonly notificationHandlerFactory: NotificationHandlerFactory,
    private readonly logger: MinimalLogger,
  ) {}

  async create(notification: unknown) {
    if (!isNotification(notification)) {
      throw new Error(`Unknown notification type: ${(notification as any).notificationType}`);
    }

    const notificationHandler = await this.notificationHandlerFactory.manufacture(notification.notificationType);

    try {
      await notificationHandler.handle((notification as any).context);
      // feathers plugin requires a unique id be returned to update local store
      return {id: +new Date()};
    } catch (err) {
      this.logger.error({err}, 'Error processing notification');
      throw err;
    }
  }
}
