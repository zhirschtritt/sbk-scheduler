import moment from 'moment';
import {NotificationHandler} from './NotificationHandlerFactory';
import {Publisher} from '../Publishers';
import {getAdminPublisher} from '../Publishers';
import {formatEmail, TemplateName} from '../../../mailer/templator';
import {NotificationContext} from '../notification.interfaces';
import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';

export class CancelledShiftHandler implements NotificationHandler {
  private readonly adminPublisher: Publisher;
  constructor(private readonly log: MinimalLogger, publishers: Map<number, Publisher[]>) {
    this.adminPublisher = getAdminPublisher(publishers);
  }

  async handle(context: Required<NotificationContext>) {
    const emailHtml = formatEmail(TemplateName.cancelledShift, context);
    const vm = {
      emailHtml,
      subjectText: `⚠️ Cancelled Upcoming Shift: ${formatDate(context.shift.date)}`,
      smsText: "cancelled upcoming shift message, this shouldn't ever get sent",
    };

    return await this.adminPublisher.publish(vm);
  }
}

function formatDate(date: string | Date) {
  return moment(date).format('dddd, MMM D, YYYY');
}
