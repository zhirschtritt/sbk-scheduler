import {WeeklyShiftUpdateHandler} from './WeeklyShiftUpdateHandler';
import {CancelledShiftHandler} from './CancelledShiftHandler';
import {TwilioClient} from '../../../twilioSMSClient/TwilioClient';
import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';
import {NotificationType, NotificationContext} from '../notification.interfaces';

export interface NotificationHandlerFactory {
  new (
    logger: MinimalLogger,
    shifts: any,
    staffMembers: any,
    mailer: any,
    smsClient: TwilioClient,
  ): NotificationHandlerFactory;

  manufacture(notificationType: NotificationType): NotificationHandler;
}

export interface NotificationHandler {
  handle(context: NotificationContext): Promise<void>;
}

export class NotificationHandlerFactory {
  private readonly log: MinimalLogger;
  private readonly smsClient: TwilioClient;
  private readonly shiftService: any;
  private readonly staffMemberService: any;
  private readonly mailer: any;

  constructor(logger: MinimalLogger, shifts: any, staffMembers: any, mailer: any, smsClient: TwilioClient) {
    this.log = logger;
    this.shiftService = shifts;
    this.staffMemberService = staffMembers;
    this.mailer = mailer;
    this.smsClient = smsClient;
  }

  manufacture(notificationType: NotificationType): NotificationHandler {
    switch (notificationType) {
      case NotificationType.weeklyShiftUpdate:
        return new WeeklyShiftUpdateHandler(
          this.log,
          this.shiftService,
          this.staffMemberService,
          this.mailer,
          this.smsClient,
        );
      case NotificationType.cancelledShift:
        return new CancelledShiftHandler(this.log, this.mailer);
      default:
        this.log.error(`Unknown notificationType ${notificationType}`);
        throw new Error(`Unknown notificationType ${notificationType}`);
    }
  }
}
