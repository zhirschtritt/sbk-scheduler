import {NotificationHandlerFactory} from './Handlers/NotificationHandlerFactory';
import {MinimalLogger} from '../../twilioSMSClient/Interfaces';
import {isNotification} from './notification.interfaces';
import {IShiftService} from '../shift/ShiftService';
import {IStaffMemberService} from '../staffMember/staffMember.interfaces';

export class NotificationService {
  constructor(
    staffMembers: IStaffMemberService,
    shiftsService: IShiftService,
    private readonly notificationHandlerFactory: NotificationHandlerFactory,
    private readonly logger: MinimalLogger,
  ) {}

  async create(notification: unknown) {
    if (!isNotification(notification)) {
      throw new Error(
        `Unknown notification type: ${(notification as any).notificationType}`,
      );
    }

    const notificationHandler = await this.notificationHandlerFactory.manufacture(
      notification.notificationType,
    );

    try {
      return await notificationHandler.handle((notification as any).context);
    } catch (error) {
      this.logger.error('Error processing notification', error);
      return new Error(error);
    }
  }
}
