import {TwilioConfig} from './ConfigProvider';
import twilio = require('twilio');
import {MessageInstance} from 'twilio/lib/rest/api/v2010/account/message';
import {MinimalLogger} from './Interfaces';

export class TwilioClient {
  private readonly client: twilio.Twilio;

  constructor(
    private readonly config: TwilioConfig,
    private readonly logger: MinimalLogger,
  ) {
    this.client = twilio(config.accountSid, config.authToken);
  }

  public async sendSms(body: string, to: string): Promise<MessageInstance> {
    const from = this.config.fromNumber;
    try {
      const res = await this.client.messages.create({
        body,
        to,
        from,
      });

      this.logger.info({res}, 'Sent twilio sms message');

      if (res.errorCode) {
        this.logger.error({res}, 'Twilio returned an error from message sent');
        throw new Error('Error sending sms message');
      }

      return res;
    } catch (error) {
      this.logger.error({error, body, from, to}, 'Error sending sms message');
      throw new Error('Error sending sms message');
    }
  }
}
