const mailgun = require('mailgun-js');

module.exports = function(app) {
  const apiKey = app.get('mailgunApiKey');
  const domain = app.get('mailgunDomain');

  return mailgun({apiKey: apiKey, domain: domain});
};
