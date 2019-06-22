// A hook that logs service method before, after and error
import {logger} from '../logger';
import {HookContext} from '@feathersjs/feathers';

export default function() {
  return (context: HookContext) => {
    // This debugs the service call and a stringified version of the hook context
    // You can customize the message (and logger) to your needs
    logger.debug({data: context.data}, `${context.path}: ${context.method.toUpperCase()}`);

    if (context.error) {
      logger.error(context.error.stack);
    }
  };
}
