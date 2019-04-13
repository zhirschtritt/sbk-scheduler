import {TwilioClient} from './TwilioClient';
import {ConfigProvider} from './ConfigProvider';
import {MinimalLogger} from './Interfaces';

export const smsClientFactory = (logger: MinimalLogger) => (app: any) => {
  const config = new ConfigProvider(
    app.get('twilioSid'),
    app.get('twilioAuthToken'),
    app.get('twilioFromNumber'),
  );
  const configuredSmsClient = new TwilioClient(config.twilioConfig, logger);

  app.set('smsClient', configuredSmsClient);
};
