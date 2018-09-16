import feathersVuex from 'feathers-vuex';
import feathersClient from '../feathersClient';

const { service } = feathersVuex(feathersClient, { idField: 'id' });

const servicePath = 'shifts';

const servicePlugin = service(servicePath, {
  instanceDefaults: {
    date: '',
    primary_staff: '',
    secondary_staff: '',
    fulfilled: 0,
    updatedAt: '',
  },
  actions: {
    updateShift({ commit, state, dispatch }) {
      const { currentId, copy: updatedShift } = state;

      dispatch('patch', [currentId, updatedShift, {}])
        .then(() => {
          commit('commitCopy', currentId);
        })
        .catch(() => {
          commit('rejectCopy', currentId);
        });
    },

    rejectUpdateShift({ commit, state }) {
      const { currentId } = state;

      commit('rejectCopy', currentId);
    },

    stageUpdateShift({ commit, state }, { memberName, shift, isPrimary }) {
      const shiftCopy = Object.assign({}, shift);

      commit('setCurrent', shiftCopy);

      if (isPrimary) {
        state.copy.primary_staff = memberName;
      } else {
        state.copy.secondary_staff = memberName;
      }

      const hasAtLeastOneStaff = !!(state.copy.primary_staff || state.copy.secondary_staff);

      state.copy.fulfilled = hasAtLeastOneStaff ? 1 : 0;
    },
  },
});

export default servicePlugin;
