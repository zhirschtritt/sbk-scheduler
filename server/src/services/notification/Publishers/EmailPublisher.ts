import {Publisher, NotificationViewModel} from './interfaces';

export class EmailPublsiher implements Publisher {
  // TODO: shoud inject logger for error handling
  constructor(private readonly emailClient: any, private readonly recipientEmailAddress: string) {}

  async publish(viewModel: NotificationViewModel) {
    try {
      return await this.emailClient.sendEmail(viewModel.emailHtml, viewModel.subjectText, this.recipientEmailAddress);
    } catch (err) {
      throw new Error(err);
    }
  }
}
