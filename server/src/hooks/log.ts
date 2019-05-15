// A hook that logs service method before, after and error
import {logger} from '../logger';

export default function() {
  return (context: any) => {
    // This debugs the service call and a stringified version of the hook context
    // You can customize the message (and logger) to your needs
    logger.debug(`${context.type} logger.service('${context.path}').${context.method}()`);

    if (context.error) {
      logger.error(context.error.stack);
    }
  };
}
