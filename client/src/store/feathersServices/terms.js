import feathersVuex from 'feathers-vuex';
import feathersClient from '../feathersClient';

const { service } = feathersVuex(feathersClient, { idField: 'id' });

const servicePath = 'terms';

const servicePlugin = service(servicePath, {});

export default servicePlugin;
