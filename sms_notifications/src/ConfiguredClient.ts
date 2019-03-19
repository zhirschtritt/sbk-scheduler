import {TwilioClient} from './TwilioClient';
import {ConfigProvider} from './ConfigProvider';
import {MinimalLogger} from './Interfaces';

export const configuredClient = (logger: MinimalLogger) =>
  new TwilioClient(new ConfigProvider().twilioConfig, logger);
