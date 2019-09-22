import feathersVuex from 'feathers-vuex';
import feathersClient from '../feathersClient';

// the plugin requires that a unique id field be returned in res
const { service } = feathersVuex(feathersClient, { idField: 'id' });

const servicePath = 'notifications';

const servicePlugin = service(servicePath, {
  instanceDefaults: {
    notificationType: '',
    customMessage: '',
    context: {
      shift: {},
      staffMember: {},
    },
  },
});

export default servicePlugin;
