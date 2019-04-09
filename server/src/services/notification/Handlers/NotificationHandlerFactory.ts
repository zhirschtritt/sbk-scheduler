import {WeeklyShiftUpdateHandler} from './WeeklyShiftUpdateHandler';
import {CancelledShiftHandler} from './CancelledShiftHandler';
import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';
import {NotificationType, NotificationContext} from '../notification.interfaces';
import {CompositePublisherFactory} from '../Publishers/PublisherFactory';
import {IShiftService} from '../../shift/ShiftService';
import {IStaffMemberService} from '../../staffMember/StaffMemberService';

export interface NotificationHandler {
  handle(context: NotificationContext): Promise<void>;
}

export class NotificationHandlerFactory {
  constructor(
    private readonly logger: MinimalLogger,
    private readonly shiftService: IShiftService,
    private readonly staffMemberService: IStaffMemberService,
    private readonly publisherFactory: CompositePublisherFactory,
  ) {}

  async manufacture(notificationType: NotificationType): Promise<NotificationHandler> {
    switch (notificationType) {
      case NotificationType.weeklyShiftUpdate:
        const staff = await this.staffMemberService.find();
        const staffPublishers = this.publisherFactory.manufacture(staff);
        return new WeeklyShiftUpdateHandler(this.logger, this.shiftService, staffPublishers, staff);
      case NotificationType.cancelledShift:
        const publishers = this.publisherFactory.manufacture([]);
        return new CancelledShiftHandler(this.logger, publishers);
    }
  }
}
