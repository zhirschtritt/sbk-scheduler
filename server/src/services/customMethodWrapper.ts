import {Service, HookContext} from '@feathersjs/feathers';

export const customMethodWrapper = <T>(service: Service<T>, name: string) => async (context: HookContext) => {
  if (!context.data || !context.data.method || context.data.method !== name) {
    // don't apply hook intercept if not matching
    return;
  }

  context.result = await service[name].apply(service, context.data.arguments);
  return context;
};
