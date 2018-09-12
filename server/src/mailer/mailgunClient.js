const mailgun = require('mailgun-js');

module.exports = function(app) {
  const api_key = app.get('mailgunApiKey');
  const domain = app.get('mailgunDomain');

  return mailgun({apiKey: api_key, domain: domain});
};


