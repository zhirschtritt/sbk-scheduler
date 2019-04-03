import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';
import {StaffMember} from '../../staffMember/staffMember.interfaces';
import {Shift} from '../../shift/shift.interfaces';
import {NotificationHandler} from './NotificationHandlerFactory';

const moment = require('moment');

export class CancelledShiftHandler implements NotificationHandler {
  constructor(private readonly log: MinimalLogger, private readonly mailer: any) {}

  formatDate(date: string) {
    return moment(date).format('dddd, MMM D, YYYY');
  }

  async handle(context: {message: string; shift: Shift; staffMember: StaffMember}) {
    return await this.mailer.sendEmail({
      template: {
        name: 'cancelledShift',
        context: {
          shift: context.shift,
          staffMember: context.staffMember,
          message: context.message,
        },
      },
      recipients: this.mailer.staffEmail,
      subject: `⚠️ Cancelled Upcoming Shift: ${this.formatDate(context.shift.date)}`,
    });
  }
}
