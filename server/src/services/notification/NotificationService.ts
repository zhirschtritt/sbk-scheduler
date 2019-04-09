import {NotificationHandlerFactory} from './Handlers/NotificationHandlerFactory';
import {TwilioClient} from '../../twilioSMSClient/TwilioClient';
import {MinimalLogger} from '../../twilioSMSClient/Interfaces';
import {isNotification} from './notification.interfaces';
import {Shift} from '../shift/shift.interfaces';
import {Service} from '@feathersjs/feathers';
import {CompositePublisherFactory} from './Publishers/PublisherFactory';
import {BaseService} from '../interfaces';
import {StaffMember} from '../staffMember/staffMember.interfaces';
import {IShiftService} from '../shift/ShiftService';
import {IStaffMemberService} from '../staffMember/StaffMemberService';

export class NotificationService {
  constructor(
    staffMembers: IStaffMemberService,
    shiftsService: IShiftService,
    private readonly notificationHandlerFactory: NotificationHandlerFactory,
    private readonly logger: MinimalLogger,
  ) {}

  async create(notification: unknown) {
    if (!isNotification(notification)) {
      throw new Error(`Unknown notification type: ${notification}`);
    }

    const notificationHandler = await this.notificationHandlerFactory.manufacture(notification.notificationType);

    try {
      return await notificationHandler.handle((notification as any).context);
    } catch (error) {
      this.logger.error('Error processing notification', error);
      return new Error(error);
    }
  }
}
