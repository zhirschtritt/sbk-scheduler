export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export class ConfigProvider {
  readonly twilioConfig: TwilioConfig;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.twilioConfig = {accountSid, authToken, fromNumber};
  }
}
