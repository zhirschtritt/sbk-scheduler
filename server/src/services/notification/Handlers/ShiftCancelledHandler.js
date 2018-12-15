const moment = require('moment');

class ShiftCancelledHandler {
  constructor({log, message, context, mailer}) {
    this.shift = context.shift;
    this.staffMember = context.staffMember;
    this.log = log;
    this.message = message;
    this.mailer = mailer;
  }

  formatDate(date) {
    return moment(date).format('dddd, MMM D, YYYY');
  }

  handle() {
    return this.mailer.sendEmail({
      template: {
        name: 'cancelledShift',
        context: {
          shift: this.shift, 
          staffMember: this.staffMember, 
          message: this.message
        }
      },
      recipients: this.mailer.staffEmail,
      subject: `⚠️ Cancelled Upcoming Shift: ${this.formatDate(this.shift.date)}`
    });
  }
}

module.exports = {
  ShiftCancelledHandler
};