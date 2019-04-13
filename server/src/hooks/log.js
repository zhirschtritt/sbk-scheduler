// A hook that logs service method before, after and error
import {debug, error} from '../logger';

export default function() {
  return context => {
    // This debugs the service call and a stringified version of the hook context
    // You can customize the message (and logger) to your needs
    debug(`${context.type} logger.service('${context.path}').${context.method}()`);

    if (context.error) {
      error(context.error.stack);
    }
  };
}
