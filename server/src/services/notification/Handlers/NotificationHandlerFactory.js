const {WeeklyShiftUpdateHandler} = require('./WeeklyShiftUpdateHandler');
const {ShiftCancelledHandler} = require('./ShiftCancelledHandler');
const {NoopHandler} = require('./NoopHandler');

class NotificationHandlerFactory {
  constructor({logger, shifts, staffMembers, mailer}) {
    this.log = logger;
    this.shiftService = shifts;
    this.staffMemberService = staffMembers;
    this.mailer = mailer;
  }
  
  manufacture({notificationType, message, context}) {
    switch (notificationType) {
    case 'weeklyShiftUpdate':
      return new WeeklyShiftUpdateHandler({
        log: this.log, 
        shiftService: this.shiftService,
        staffMemberService: this.staffMemberService,
        mailer: this.mailer,
      }); 
    case 'cancelledShift': 
      return new ShiftCancelledHandler({
        log: this.log, 
        message, 
        context,
        mailer: this.mailer
      });
    default:
      this.log(`Unknown notificationType ${notificationType}`);
      return new NoopHandler({log: this.log});
    }
  }
}

module.exports = {
  NotificationHandlerFactory
};