import {NotificationHandlerFactory} from './Handlers/NotificationHandlerFactory';
import {TwilioClient} from '../../twilioSMSClient/TwilioClient';
import {MinimalLogger} from '../../twilioSMSClient/Interfaces';
import {isNotification} from './notification.interfaces';
import {Shift} from '../shift/shift.interfaces';
import {Service} from '@feathersjs/feathers';
import {StaffMemberSerice} from '../staffMember/StaffMemberService';

export class NotificationService {
  constructor(
    mailer: any,
    staffMembers: StaffMemberSerice,
    shiftsService: Pick<Service<Shift>, 'get' | 'find' | 'patch'>,
    private readonly notificationHandlerFactory: NotificationHandlerFactory,
    private readonly logger: MinimalLogger,
    smsClient: TwilioClient,
  ) {}

  async create(notification: unknown) {
    if (!isNotification(notification)) {
      throw new Error(`Unknown notification type: ${notification}`);
    }

    const notificationHandler = this.notificationHandlerFactory.manufacture(notification.notificationType);

    try {
      return await notificationHandler.handle((notification as any).context);
    } catch (error) {
      this.logger.error('Error processing notification', error);
      return new Error(error);
    }
  }
}
