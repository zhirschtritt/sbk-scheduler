/* eslint-disable no-console */
const CronJob = require('cron').CronJob;

class NotificationCronSchedulerFactory {
  constructor(notificationService, logger) {
    this.notificationService = notificationService;
    this.logger = logger;

    this.notificationJobs = this.notifications.map(n => {
      return n(this.notificationService, this.logger);
    });
  }

  get notifications() {
    return [sundayNotification];
  }

  start() {
    this.notificationsJobs.forEach(n => {
      this.logger.info(`starting notification: ${n.name}`);
      n.start();
    });
  }
}

function sundayNotification(notificationService, logger) {
  return new CronJob(
    '0 0 10 * * SUN',
    () => sendNotification(notificationService, logger),
    null,
    false,
    'America/New_York'
  );
}

async function sendNotification(notificationService, logger) {
  logger.info('sending notification');
  try {
    const res = await notificationService.create({
      notificationType: 'weeklyShiftUpdate'
    });
    logger.info(res ? res.data : res);
  } catch (err) {
    logger.error(err);
  }
}

module.exports = { NotificationCronSchedulerFactory };
