const mailgunClient = require('./mailgunClient');
const templator = require('./templator');
const templates = require('./templates');
const _ = require('lodash');

module.exports = function(app) {
  const mailer = {
    mailerClient: mailgunClient(app),

    staffEmail: app.get('staffEmail'),

    formatEmail: function(templateName, context) {
      const template = _.get(templates, templateName, '');
        
      const compiledTemplate = templator.compile(template);
        
      return compiledTemplate(context);
    },

    sendEmail: function({template, recipients, subject}) {
      const email = {
        from: 'SBK Notifications <scheduler@notifications.somervillebikekitchen.org>',
        to: recipients,
        subject,
        text: this.formatEmail(template.name, template.context)
      };

      return this.mailerClient.messages().send(email);
    }
  };

  app.set('mailer', mailer);
};
