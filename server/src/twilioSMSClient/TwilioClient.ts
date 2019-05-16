import {TwilioConfig} from './ConfigProvider';
import twilio = require('twilio');
import {MessageInstance} from 'twilio/lib/rest/api/v2010/account/message';
import {MinimalLogger} from './Interfaces';

export class TwilioClient {
  private readonly client: twilio.Twilio;

  constructor(private readonly config: TwilioConfig, private readonly logger: MinimalLogger) {
    this.client = twilio(config.accountSid, config.authToken);
  }

  public async sendSms(body: string, to: string): Promise<MessageInstance> {
    try {
      const response = await this.client.messages.create({
        body,
        to,
        from: this.config.fromNumber,
      });

      this.logger.info({res: response}, 'Sent twilio sms message');

      if (response.errorCode) {
        this.logger.error({res: response}, 'Twilio returned an error from message sent');
        throw new Error('Error sending sms message');
      }

      return response;
    } catch (err) {
      throw err;
    }
  }
}
