<template>
  <div>
    <v-toolbar dark color="primary" dense flat>
      <v-icon>people</v-icon>
      <v-toolbar-title>Staff Members</v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="staffMembers"
      hide-actions
      dense
      :loading="areStaffMembersLoading"
    >
      <template slot="no-data">Loading...</template>
      <template slot="items" slot-scope="props">
        <td class="text-capitalize pr-1">{{ props.item.name }}</td>
        <td class="px-1">
          <v-chip
            label
            outline
            :disabled="shift.isPastShift"
            :color="shift.isPastShift ? 'grey' : 'primary'"
            :key="shift.id"
            v-for="shift in shiftsForStaffMember(props.item.name)"
          >{{ shift.date | formatDateWithWeekday }}</v-chip>
        </td>
        <td class="pl-1">
          <v-layout align-center justify-center column class="pt-3">
            <v-switch
              :value="props.item.notifications"
              :value-comparator="function(val) { return(!!val)}"
              color="primary"
              light
              debounce="20"
              @change="updateNotifications(props.item)"
            >
              <template v-slot:prepend>
                <v-tooltip left>
                  <v-icon slot="activator">fa-envelope-o</v-icon>
                  <span>Email Notifications</span>
                </v-tooltip>
              </template>
            </v-switch>
            <v-switch
              v-if="props.item.phoneNumber"
              :value="props.item.textNotifications"
              :value-comparator="function(val) { return(!!val)}"
              color="#5C6BC0"
              light
              debounce="20"
              @change="updateTextNotifications(props.item)"
            >
              <template v-slot:prepend>
                <v-tooltip left>
                  <v-icon slot="activator">fa-commenting-o</v-icon>
                  <span>Text Notifications</span>
                </v-tooltip>
              </template>
            </v-switch>
          </v-layout>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data: () => ({
    headers: [
      { text: 'Staff Member', value: 'name', class: 'pr-0' },
      { text: 'Scheduled Shifts', sortable: false },
      { text: 'Reminders', sortable: false },
    ],
  }),

  computed: {
    ...mapState('staffMembers', { areStaffMembersLoading: 'isFindPending' }),
    ...mapGetters('shifts', { findShiftsInStore: 'find' }),
    ...mapGetters('staffMembers', { findStaffMembersInStore: 'find' }),

    staffMembers() {
      return this.findStaffMembersInStore().data;
    },
  },

  methods: {
    shiftsForStaffMember(staffMemberName) {
      const query = {
        $or: [
          { primary_staff: staffMemberName },
          { secondary_staff: staffMemberName },
        ],
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
      await updatedStaffMember.patch();
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
      await updatedStaffMember.patch();
    },
  },
};
</script>
