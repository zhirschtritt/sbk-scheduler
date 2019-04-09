import {Publisher, NotificationViewModel} from './interfaces';
import {MailgunClient} from '../../../mailer/mailgunClient';

export class EmailPublsiher implements Publisher {
  // TODO: shoud inject logger for error handling
  constructor(private readonly emailClient: MailgunClient, private readonly recipientEmailAddress: string) {}

  async publish(viewModel: NotificationViewModel) {
    try {
      return await this.emailClient.sendEmail(viewModel.emailHtml, this.recipientEmailAddress, viewModel.subjectText);
    } catch (err) {
      throw new Error(err);
    }
  }
}
