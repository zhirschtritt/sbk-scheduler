import {TwilioClient} from '../../../twilioSMSClient/TwilioClient';
import {Publisher, NotificationViewModel} from './interfaces';
import logger from '../../../logger';

export class SmsPublisher implements Publisher {
  constructor(private readonly twilioClient: TwilioClient, private readonly recipientPhoneNumber: string) {}

  async publish(viewModel: NotificationViewModel) {
    logger.debug({viewModel}, 'Sending sms');
    try {
      await this.twilioClient.sendSms(viewModel.smsText, this.recipientPhoneNumber);
    } catch (err) {
      logger.error({err}, 'Error sending sms message');
      throw new Error(err);
    }
  }
}
