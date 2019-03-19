const smsClient = require('../../sms_notifications/dist/ConfiguredClient');
const logger = require('./logger');

module.exports = function(app) {
  app.set('smsClient', smsClient(logger));
};
