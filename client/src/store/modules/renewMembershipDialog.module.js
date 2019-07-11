export default {
  namespaced: true,
  state: {
    visable: false,
  },
  mutations: {
    show(state) {
      state.visable = true;
    },
    toggle(state) {
      state.visable = !state.visable;
    },
  },
  actions: {
    // not sure why get/set v-model wants 'hide' to be an action rather than mutation...
    hide({ state }) {
      state.visable = false;
    },
  },
};
