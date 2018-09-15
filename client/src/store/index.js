import Vue from 'vue';
import Vuex from 'vuex';
import feathersServices from './feathersServices';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cancelShiftDialog: false,
  },
  mutations: {
    toggleCancelShiftDialog(state) {
      state.cancelShiftDialog = !state.cancelShiftDialog;
    },
  },
  actions: {},
  plugins: feathersServices,
});
