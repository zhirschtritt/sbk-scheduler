import Vue from 'vue';
import Vuex from 'vuex';
import feathersVuex from 'feathers-vuex';
import feathersClient from './feathersClient';

const { service } = feathersVuex(feathersClient);

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  plugins: [
    service('shifts'),
    service('members'),
    service('terms'),
  ],
});
