/* eslint-disable no-console */
const CronJob = require('cron').CronJob;

async function sendNotification(notificationService, logger) {
  logger.info('sending notification');
  try {
    const res = await notificationService.create({
      notificationType: 'weeklyShiftUpdate',
    });
    logger.info(res ? res.data : res);
  } catch (err) {
    logger.error(err);
  }
}

function sundayNotification(notificationService, logger) {
  return new CronJob(
    '0 0 10 * * SUN',
    () => sendNotification(notificationService, logger),
    null,
    false,
    'America/New_York',
  );
}

class NotificationCronSchedulerFactory {
  constructor(notificationService, logger) {
    this.notificationService = notificationService;
    this.logger = logger;
    this.notifcationMap = new Map();
    this.addNotificationsToMap();
  }

  start() {
    this.notifcationMap.forEach((notification, notificaitonName) => {
      this.logger.info(`Starting notification ${notificaitonName}`);
      notification.start();
    });
  }

  addNotificationsToMap() {
    [sundayNotification].forEach(n => {
      this.notifcationMap.set(
        `${n.name}`,
        n(this.notificationService, this.logger),
      );
    });
  }
}

module.exports = {NotificationCronSchedulerFactory, sendNotification};
