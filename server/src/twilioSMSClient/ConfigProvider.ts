export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export class ConfigProvider {
  readonly twilioConfig: TwilioConfig;

  constructor() {
    this.twilioConfig = {
      accountSid: 'test',
      authToken: 'test_auth_token',
      fromNumber: '12346',
    };
  }
}
