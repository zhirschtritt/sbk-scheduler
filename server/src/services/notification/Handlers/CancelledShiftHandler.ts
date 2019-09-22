import moment from 'moment';
import {NotificationHandler} from './NotificationHandlerFactory';
import {Publisher, PublisherFactory} from '../Publishers';
import {formatEmail, TemplateName} from '../../../mailer/templator';
import {CancelledShiftNotification} from '../notification.interfaces';
import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';

export class CancelledShiftHandler implements NotificationHandler {
  private readonly adminPublisher: Publisher;
  constructor(private readonly log: MinimalLogger, publisherFactory: PublisherFactory) {
    this.adminPublisher = publisherFactory.manufactureAdminPublisher();
  }

  async handle(notification: CancelledShiftNotification) {
    const {context} = notification;
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
