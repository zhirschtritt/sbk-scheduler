import {WeeklyShiftUpdateHandler} from './WeeklyShiftUpdateHandler';
import {CancelledShiftHandler} from './CancelledShiftHandler';
import {NotificationType, Notification} from '../notification.interfaces';
import {PublisherFactory} from '../Publishers';
import {IShiftService} from '../../shift/ShiftService';
import {IStaffMemberService} from '../../staffMember/staffMember.interfaces';
import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';
import {DayOfUpdateHandler} from './DayOfUpdateHandler';

export interface NotificationHandler {
  handle(notification: Notification): Promise<void>;
}

export class NotificationHandlerFactory {
  constructor(
    private readonly logger: MinimalLogger,
    private readonly shiftService: IShiftService,
    private readonly staffMemberService: IStaffMemberService,
    private readonly publisherFactory: PublisherFactory,
  ) {}

  async manufacture(notificationType: NotificationType): Promise<NotificationHandler> {
    if (notificationType === NotificationType.cancelledShift) {
      return new CancelledShiftHandler(this.logger, this.publisherFactory);
    }

    const staff = await this.staffMemberService.find();

    if (notificationType === NotificationType.weeklyShiftUpdate) {
      return new WeeklyShiftUpdateHandler(this.logger, this.shiftService, this.publisherFactory, staff);
    }

    if (notificationType === NotificationType.dayOfShiftUpdate) {
      return new DayOfUpdateHandler(this.logger, this.shiftService, this.publisherFactory, staff);
    }

    throw new Error('Should never get here');
  }
}
