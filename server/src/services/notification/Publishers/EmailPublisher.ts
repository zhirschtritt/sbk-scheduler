import {Publisher, NotificationViewModel} from './interfaces';
import {MailgunClient} from '../../../mailer/MailgunClient';
import logger from '../../../logger';

export class EmailPublsiher implements Publisher {
  // TODO: shoud inject logger for error handling
  constructor(private readonly emailClient: MailgunClient, private readonly recipientEmailAddress: string) {}

  async publish(viewModel: NotificationViewModel) {
    logger.debug({viewModel}, 'Sending email');
    try {
      return await this.emailClient.sendEmail(viewModel.emailHtml, this.recipientEmailAddress, viewModel.subjectText);
    } catch (err) {
      logger.error({err}, 'error publishing email');
      throw new Error(err);
    }
  }
}
