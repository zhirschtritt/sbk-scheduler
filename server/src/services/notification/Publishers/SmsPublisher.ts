import {TwilioClient} from '../../../twilioSMSClient/TwilioClient';
import {Publisher, NotificationViewModel} from './interfaces';

export class SmsPublisher implements Publisher {
  constructor(private readonly twilioClient: TwilioClient, private readonly recipientPhoneNumber: string) {}

  async publish(viewModel: NotificationViewModel) {
    this.twilioClient.sendSms(viewModel.smsText, this.recipientPhoneNumber);
  }
}
