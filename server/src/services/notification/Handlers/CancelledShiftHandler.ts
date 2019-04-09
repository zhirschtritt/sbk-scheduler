import moment from 'moment';
import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';
import {NotificationHandler} from './NotificationHandlerFactory';
import {Publisher} from '../Publishers';
import {getAdminPublisher} from '../Publishers/PublisherFactory';
import {formatEmail, TemplateName} from '../../../mailer/templator';
import {NotificationContext} from '../notification.interfaces';

export class CancelledShiftHandler implements NotificationHandler {
  private readonly adminPublisher: Publisher;
  constructor(private readonly log: MinimalLogger, publishers: Map<number, Publisher[]>) {
    this.adminPublisher = getAdminPublisher(publishers);
  }

  async handle(context: Required<NotificationContext>) {
    const vm = {
      emailHtml: formatEmail(TemplateName.cancelledShift, context),
      subjectText: `⚠️ Cancelled Upcoming Shift: ${formatDate(context.shift.date)}`,
      smsText: '',
    };

    return await this.adminPublisher.publish(vm);
  }
}

function formatDate(date: string) {
  return moment(date).format('dddd, MMM D, YYYY');
}
