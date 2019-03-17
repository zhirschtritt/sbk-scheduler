const { WeeklyShiftUpdateHandler } = require('./WeeklyShiftUpdateHandler');
const { ShiftCancelledHandler } = require('./ShiftCancelledHandler');
const { NoopHandler } = require('./NoopHandler');

class NotificationHandlerFactory {
  constructor({ logger, shifts, staffMembers, mailer }) {
    this.log = logger;
    this.shiftService = shifts;
    this.staffMemberService = staffMembers;
    this.mailer = mailer;
  }

  manufacture({ notificationType, message, context }) {
    switch (notificationType) {
    case 'weeklyShiftUpdate':
      return new WeeklyShiftUpdateHandler({
        log: this.log,
        shiftService: this.shiftService,
        staffMemberService: this.staffMemberService,
        mailer: this.mailer
      });
    case 'cancelledShift':
      return new ShiftCancelledHandler({
        log: this.log,
        message,
        context,
        mailer: this.mailer
      });
    default:
      this.log.error(`Unknown notificationType ${notificationType}`);
      throw new Error(`Unknown notificationType ${notificationType}`);
    }
  }
}

module.exports = {
  NotificationHandlerFactory
};
