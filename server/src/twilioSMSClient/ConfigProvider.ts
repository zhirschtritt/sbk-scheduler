import logger from '../logger';
import {EPROTONOSUPPORT} from 'constants';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export class ConfigProvider {
  readonly twilioConfig: TwilioConfig;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.validateAccountConfig(accountSid, authToken, fromNumber);

    this.twilioConfig = {accountSid, authToken, fromNumber};
  }

  validateAccountConfig(accountSid: string, authToken: string, fromNumber: string) {
    if (!accountSid) {
      throw new Error('Missing twilio accountSID!');
    }
    if (!authToken) {
      throw new Error('Missing twilio authToken!');
    }
    if (!fromNumber) {
      throw new Error('Missing twilio fromNumber!');
    }
  }
}
