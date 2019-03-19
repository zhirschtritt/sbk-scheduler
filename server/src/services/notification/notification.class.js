class Service {
  constructor({
    mailer,
    staffMembers,
    shifts,
    NotificationHandlerFactory,
    logger,
    smsClient
  }) {
    this.notificationHandlerFactory = new NotificationHandlerFactory({
      logger,
      shifts,
      staffMembers,
      mailer,
      smsClient
    });
    this.log = logger;
  }

  async create({ notificationType, message, context }) {
    const notificationHandler = this.notificationHandlerFactory.manufacture({
      notificationType,
      message,
      context
    });

    try {
      return await notificationHandler.handle();
    } catch (error) {
      this.log.error('Error processing notification', error);
      return new Error(error);
    }
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;

// notification = {
//   notificationType: String,
//   message: String,
//   context: {
//     shift: Shift,
//     staffMember: StaffMember,
//   }
// }
