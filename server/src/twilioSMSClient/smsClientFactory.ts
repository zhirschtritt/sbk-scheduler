import {configuredSmsClient} from './ConfiguredClientFactory';
import {MinimalLogger} from './Interfaces';

export const smsClientFactory = (logger: MinimalLogger) => (app: any) => {
  app.set('smsClient', configuredSmsClient(logger));
};
