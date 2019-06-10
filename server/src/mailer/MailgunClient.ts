import mailgun from 'mailgun-js';
import {Application} from '@feathersjs/feathers';

export function mailgunClientFactory(app: Application<any>) {
  const apiKey = app.get('mailgunApiKey');
  const domain = app.get('mailgunDomain');

  app.set('mailer', new MailgunClient(mailgun({apiKey, domain})));
}

export class MailgunClient {
  constructor(private readonly mailgun: mailgun.Mailgun) {}

  sendEmail(emailHtml: string, recipient: string, subject: string) {
    const email = {
      from: 'SBK Notifications <scheduler@notifications.somervillebikekitchen.org>',
      to: recipient,
      subject,
      html: emailHtml,
    };

    this.mailgun.messages().send(email);
  }
}
