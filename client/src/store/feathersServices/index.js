import feathersVuex from 'feathers-vuex';

import feathersClient from './feathersClient';

import members from './members';
import shifts from './shifts';
import terms from './terms';

const { service } = feathersVuex(feathersClient, { idField: 'id' });

export default [
  members,
  shifts,
  terms,
].map(feathersService => service(feathersService.name, feathersService.methods));
