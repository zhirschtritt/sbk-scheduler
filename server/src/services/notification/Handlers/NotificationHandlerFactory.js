const { WeeklyShiftUpdateHandler } = require('./WeeklyShiftUpdateHandler');
const { ShiftCancelledHandler } = require('./ShiftCancelledHandler');

class NotificationHandlerFactory {
  constructor({ logger, shifts, staffMembers, mailer, smsClient }) {
    this.log = logger;
    this.shiftService = shifts;
    this.staffMemberService = staffMembers;
    this.mailer = mailer;
    this.smsClient = smsClient;
  }

  manufacture({ notificationType, message, context }) {
    switch (notificationType) {
    case 'weeklyShiftUpdate':
      return new WeeklyShiftUpdateHandler({
        log: this.log,
        shiftService: this.shiftService,
        staffMemberService: this.staffMemberService,
        mailer: this.mailer,
        smsClient: this.smsClient
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
