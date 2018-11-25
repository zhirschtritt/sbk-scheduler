import feathersVuex from 'feathers-vuex';
import feathersClient from '../feathersClient';

const { service } = feathersVuex(feathersClient, { idField: 'id' });

const servicePath = 'staffMembers';

const servicePlugin = service(servicePath, {
  actions: {
    setCurrentByName({ commit, getters }, staffMemberName) {
      const [staffMember] = getters.find({ query: { name: staffMemberName.toLowerCase() } }).data;

      commit('setCurrent', staffMember);
    },
  },
});

export default servicePlugin;
