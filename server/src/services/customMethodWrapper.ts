import {Service, HookContext} from '@feathersjs/feathers';

export const customMethodWrapper = <T>(service: Service<T>, name: string) => async (hook: HookContext) => {
  if (!hook.data || !hook.data.method || hook.data.method !== name) {
    // don't apply hook intercept if not matching
    return;
  }

  hook.result = await service[name].apply(service, hook.data.arguments);
};
