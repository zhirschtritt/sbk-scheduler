<template>
  <div>
    <v-toolbar
      dark
      color="primary"
      dense
      flat>
      <v-icon>today</v-icon>
      <v-toolbar-title>Volunteer Schedule</v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="shifts"
      hide-actions
      dense
      :loading="areShiftsLoading"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td :class="{pastShift: props.item.isPastShift}">
          {{ props.item.date | formatDateWithWeekday }}
          <span v-if="props.item.isNextUpcoming">
            <v-icon small color="primary">star</v-icon>
          </span>
        </td>
        <td :class="{pastShift: props.item.isPastShift}">
          <MemberSelector
            :shift="props.item"
            :members="members"
            :set-new-staff="setNewStaff"
            :is-primary="true"
          />
        </td>
        <td :class="{pastShift: props.item.isPastShift}">
          <MemberSelector
            :shift="props.item"
            :members="members"
            :set-new-staff="setNewStaff"
            :is-primary="false"
          />
        </td>
      </template>
      <template slot="no-data">
        Loading...
      </template>
      <template slot="footer">
        <td colspan="100%">
          <v-icon small color="primary">star</v-icon> = Next upcoming shift
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from 'moment';
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import MemberSelector from './MemberSelector.vue';

export default {
  components: {
    MemberSelector,
  },

  data: () => ({
    headers: [
      { text: 'Date', value: 'date' },
      { text: 'Primary Staff', value: 'primary_staff' },
      { text: 'Secondary Staff', value: 'secondary_staff' },
    ],
  }),

  computed: {
    ...mapState('shifts', { areShiftsLoading: 'isFindPending' }),
    ...mapGetters('shifts', { findShiftsInStore: 'find' }),
    ...mapGetters('members', { findMembersInStore: 'find' }),

    shifts() {
      return this.findShiftsInStore().data;
    },
    members() {
      return this.findMembersInStore().data;
    },
  },

  methods: {
    ...mapActions(['toggleCancelShiftDialog']),
    ...mapActions('shifts', ['updateShift', 'stageUpdateShift']),
    ...mapActions('members', { setCurrentMember: 'setCurrentByName' }),

    setNewStaff(memberName, shift, isPrimary) {
      // set current member for use by confirm workflow
      this.stageUpdateShift({ memberName, shift, isPrimary });

      const now = moment();
      const lastChange = shift.updatedAt ? moment(shift.updatedAt) : moment();
      const minutesSinceLastUpdate = now.diff(lastChange, 'minutes');

      // if clearing primary member, signal confirm dialog, else, clear immediately
      if (!memberName && isPrimary && minutesSinceLastUpdate > 59) {
        this.setCurrentMember(shift.primary_staff);
        this.toggleCancelShiftDialog();
      } else {
        this.updateShift();
      }
    },
  },
};
</script>

<style>
  .pastShift {
    background-color: #FAFAFA;
  }
</style>
