<template>
  <div>
    <v-toolbar dark color="primary" dense flat>
      <v-icon>today</v-icon>
      <v-toolbar-title>Staff Schedule</v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
    <v-data-table :headers="headers" :items="shifts" hide-actions dense :loading="areShiftsLoading">
      <template slot="no-data">Loading...</template>
      <template slot="footer">
        <td colspan="100%">
          <v-icon small color="primary">star</v-icon>= Next upcoming shift
        </td>
      </template>
      <template slot="items" slot-scope="props">
        <td class="pr-1" :class="{pastShift: props.item.isPastShift}">
          {{ props.item.date | formatDateWithWeekday }}
          <span v-if="props.item.isNextUpcoming">
            <v-icon small color="primary">star</v-icon>
          </span>
          <span v-if="!props.item.shop_open">
            <strong>(Shop Closed)</strong>
          </span>
        </td>
        <td class="px-1" :class="{pastShift: props.item.isPastShift}">
          <StaffMemberSelector
            :shift="props.item"
            :staff-members="staffMembers"
            :set-new-staff="setNewStaff"
            :is-primary="true"
          />
        </td>
        <td class="px-1" :class="{pastShift: props.item.isPastShift}">
          <StaffMemberSelector
            :shift="props.item"
            :staff-members="staffMembers"
            :set-new-staff="setNewStaff"
            :is-primary="false"
          />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import StaffMemberSelector from './StaffMemberSelector.vue';

export default {
  components: {
    StaffMemberSelector
  },

  data: () => ({
    headers: [
      { text: 'Date', value: 'date' },
      { text: 'Primary Staff', value: 'primary_staff' },
      { text: 'Secondary Staff', value: 'secondary_staff' }
    ]
  }),

  computed: {
    ...mapState('shifts', { areShiftsLoading: 'isFindPending' }),
    ...mapGetters('shifts', { findShiftsInStore: 'find' }),
    ...mapGetters('staffMembers', { findStaffMembersInStore: 'find' }),

    shifts() {
      return this.findShiftsInStore().data;
    },
    staffMembers() {
      return this.findStaffMembersInStore().data;
    }
  },

  methods: {
    ...mapActions(['toggleCancelShiftDialog']),
    ...mapActions('shifts', ['updateShift', 'stageUpdateShift']),
    ...mapActions('staffMembers', {
      setCurrentStaffMember: 'setCurrentByName'
    }),
    ...mapMutations('snackBar', { showSnackbar: 'show' }),

    setNewStaff(staffMemberName, shift, isPrimary) {
      // set current member for use by confirm workflow
      this.stageUpdateShift({ staffMemberName, shift, isPrimary });

      const now = moment();
      const lastChange = shift.updatedAt ? moment(shift.updatedAt) : moment();
      const minutesSinceLastUpdate = now.diff(lastChange, 'minutes');

      // if clearing primary member, signal confirm dialog, else, clear immediately
      if (!staffMemberName && isPrimary && minutesSinceLastUpdate > 59) {
        this.setCurrentStaffMember(shift.primary_staff);
        this.toggleCancelShiftDialog();
      } else {
        try {
          this.updateShift();
          this.showSnackbar({
            text: 'Shift updated',
            color: 'primary'
          });
        } catch (err) {
          this.showSnackbar({ text: 'Error updating shift', color: 'error' });
          throw err;
        }
      }
    }
  }
};
</script>

<style>
.pastShift {
  background-color: #fafafa;
}
</style>
