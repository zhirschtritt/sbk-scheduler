import Vue from "vue";
import Vuex from "vuex";
import feathersVuex from "feathers-vuex";
import feathersClient from "./feathersClient";
import snackBar from "./modules/snackBar.module";
import renewMembershipDialog from "./modules/renewMembershipDialog.module";
import editMemberDialog from "./modules/editMemberDialog.module";

const { FeathersVuex } = feathersVuex(feathersClient, { idField: "id" });

Vue.use(Vuex);
Vue.use(FeathersVuex);

const requireModule = require.context(
  // The relative path holding the service modules
  "./feathersServices",
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports)
  /.js$/
);
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);

export default new Vuex.Store({
  state: {
    cancelShiftDialog: false
  },
  actions: {
    // TODO: cancelShiftDialog should have it's own store
    // toggleShiftDialog should not update notifications store
    toggleCancelShiftDialog({ state, commit }) {
      commit("notifications/addItem", { id: 1 });
      commit("notifications/setCurrent", 1);
      state.cancelShiftDialog = !state.cancelShiftDialog;
    },

    async updateSelectedTerm({ commit, dispatch }, term) {
      commit("terms/setCurrent", term);

      const { start, end } = term;

      commit("shifts/clearAll");
      await dispatch("shifts/find", { query: { start, end } });
      commit("shifts/setPastAndUpcomingShifts");
    }
  },
  plugins: [...servicePlugins],
  modules: { snackBar, renewMembershipDialog, editMemberDialog }
});
