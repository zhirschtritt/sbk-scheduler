import feathersVuex from 'feathers-vuex';
import feathersClient from '../feathersClient';

const { service } = feathersVuex(feathersClient, { idField: 'id' });

const servicePath = 'notifications';

const servicePlugin = service(servicePath, {
  instanceDefaults: {
    notificationType: '',
    message: '',
    context: {
      shift: {},
      memeber: {},
    },
  },
});

export default servicePlugin;
