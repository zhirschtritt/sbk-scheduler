<template>
  <div>
    <v-toolbar dark color="primary" dense flat>
      <v-icon>people</v-icon>
      <v-toolbar-title>Staff Members</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="staffMembers"
      hide-actions
      dense
      :loading="areStaffMembersLoading"
    >
      <template slot="no-data">Loading...</template>
      <template slot="items" slot-scope="{item : staffMember}">
        <td class="text-capitalize pr-1">{{ staffMember.name }}</td>
        <td class="px-1">
          <v-chip
            label
            outline
            :disabled="shift.isPastShift"
            :color="shift.isPastShift ? 'grey' : 'primary'"
            :key="shift.id"
            v-for="shift in shiftsForStaffMember(staffMember.name)"
          >{{ shift.date | formatDateWithWeekday }}</v-chip>
        </td>
        <td class="pl-1">
          <v-layout align-center justify-center column class="pt-3">
            <LabeledSwitch
              :switchPredicate="!!staffMember.email"
              :switchValue="!!staffMember.notifications"
              :switchAction="() => updateNotifications(staffMember)"
              switchLabel="Email Notifications"
              color="primary"
              icon="fa-envelope-o"
            />
            <LabeledSwitch
              :switchPredicate="!!staffMember.phoneNumber"
              :switchValue="!!staffMember.textNotifications"
              :switchAction="() => updateTextNotifications(staffMember)"
              switchLabel="Text Notifications"
              color="secondary"
              icon="fa-commenting-o"
            />
          </v-layout>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import LabeledSwitch from './LabeledSwitch.vue';

export default {
  components: {
    LabeledSwitch
  },
  data: () => ({
    headers: [
      { text: 'Staff Member', value: 'name', class: 'pr-0' },
      { text: 'Scheduled Shifts', sortable: false },
      { text: 'Reminders', sortable: false }
    ]
  }),

  computed: {
    ...mapState('staffMembers', { areStaffMembersLoading: 'isFindPending' }),
    ...mapGetters('shifts', { findShiftsInStore: 'find' }),
    ...mapGetters('staffMembers', { findStaffMembersInStore: 'find' }),

    staffMembers() {
      return this.findStaffMembersInStore().data;
    }
  },

  methods: {
    ...mapMutations('snackBar', { showSnackbar: 'show' }),

    shiftsForStaffMember(staffMemberName) {
      const query = {
        $or: [
          { primary_staff: staffMemberName },
          { secondary_staff: staffMemberName }
        ]
      };
      return this.findShiftsInStore({ query }).data;
    },

    async updateNotifications(staffMember) {
      const newNotificationValue = staffMember.notifications ? 0 : 1;
      const updatedStaffMember = staffMember.clone();

      updatedStaffMember.notifications = newNotificationValue;

      /**
       * the order is important here, eager commit to local store and await remote patch
       * so there isn't a weird gui glitchy behavior
       */
      updatedStaffMember.commit();
      try {
        await updatedStaffMember.patch();
        this.showSnackbar({
          text: 'Notification preferences updated',
          color: 'primary'
        });
      } catch (err) {
        this.showSnackbar({
          text: 'Error updating notification preferences',
          color: 'secondary'
        });
        throw err;
      }
    },
    async updateTextNotifications(staffMember) {
      const newNotificationValue = staffMember.textNotifications ? 0 : 1;
      const updatedStaffMember = staffMember.clone();

      updatedStaffMember.textNotifications = newNotificationValue;

      /**
       * the order is important here, eager commit to local store and await remote patch
       * so there isn't a weird gui glitchy behavior
       */
      updatedStaffMember.commit();
      try {
        await updatedStaffMember.patch();
        this.showSnackbar({
          text: 'Notification preferences updated',
          color: 'primary'
        });
      } catch (err) {
        this.showSnackbar({
          text: 'Error updating notification preferences',
          color: 'secondary'
        });
        throw err;
      }
    }
  }
};
</script>
