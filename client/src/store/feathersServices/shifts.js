import feathersVuex from "feathers-vuex";
import moment from "moment";
import feathersClient from "../feathersClient";

const { service } = feathersVuex(feathersClient, { idField: "id" });

const servicePath = "shifts";

const servicePlugin = service(servicePath, {
  instanceDefaults: {
    date: "",
    primary_staff: "",
    secondary_staff: "",
    fulfilled: 0,
    updatedAt: "",
  },
  mutations: {
    setPastAndUpcomingShifts(state) {
      const shifts = state.keyedById;
      let foundNext = false;

      Object.keys(shifts).forEach((shiftId) => {
        const shiftEod = moment(shifts[shiftId].date).add(24, "hours");
        const hoursToNextShift = shiftEod.diff(moment(), "hours");

        if (hoursToNextShift <= 0) {
          shifts[shiftId] = { ...shifts[shiftId], isPastShift: true };
        }

        if (hoursToNextShift > 0) {
          if (!foundNext && shifts[shiftId].shop_open) {
            shifts[shiftId] = {
              ...shifts[shiftId],
              isNextUpcoming: true,
              isPastShift: false,
            };
            foundNext = true;
          } else {
            shifts[shiftId] = { ...shifts[shiftId], isPastShift: false };
          }
        }
      });
    },
  },

  actions: {
    async updateShift({ commit, state, dispatch }) {
      const { currentId, copy: updatedShift } = state;

      try {
        await dispatch("patch", [currentId, updatedShift, {}]);
      } catch (err) {
        commit("rejectCopy", currentId);
        throw err;
      }
    },

    rejectUpdateShift({ commit, state }) {
      const { currentId } = state;

      commit("rejectCopy", currentId);
    },

    stageUpdateShift({ commit, state }, { staffMemberName, shift, isPrimary }) {
      const shiftCopy = Object.assign({}, shift);

      commit("setCurrent", shiftCopy);

      if (isPrimary) {
        state.copy.primary_staff = staffMemberName;
      } else {
        state.copy.secondary_staff = staffMemberName;
      }

      const hasAtLeastOneStaff = !!(
        state.copy.primary_staff || state.copy.secondary_staff
      );

      state.copy.fulfilled = hasAtLeastOneStaff ? 1 : 0;
    },
  },
});

export default servicePlugin;
