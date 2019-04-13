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
      <template slot="items" slot-scope="props">
        <td class="text-capitalize">{{ props.item.name }}</td>
        <td>
          <v-chip
            label
            outline
            :disabled="shift.isPastShift"
            :color="shift.isPastShift ? 'grey' : 'primary'"
            :key="shift.id"
            v-for="shift in shiftsForStaffMember(props.item.name)"
          >{{ shift.date | formatDateWithWeekday }}</v-chip>
        </td>
        <td>
          <v-switch
            :value="props.item.notifications"
            :value-comparator="function(val) { return(!!val)}"
            color="primary"
            light
            @change="updateNotifications(props.item)"
          />
        </td>
        <td>
          <v-switch
            :value="props.item.textNotifications"
            :value-comparator="function(val) { return(!!val)}"
            color="primary"
            light
            @change="updateTextNotifications(props.item)"
          />
        </td>
      </template>
      <template slot="no-data">Loading...</template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data: () => ({
    headers: [
      { text: 'Staff Member', value: 'name' },
      { text: 'Scheduled Shifts', sortable: false },
      { text: 'Email Reminders', sortable: false },
      { text: 'Text Reminders', sortable: false },
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

    updateNotifications(staffMember) {
      const newNotificationValue = staffMember.notifications ? 0 : 1;
      const updatedStaffMember = staffMember.clone();

      updatedStaffMember.notifications = newNotificationValue;

      updatedStaffMember.commit();
      updatedStaffMember.patch();
    },
    updateTextNotifications(staffMember) {
      const newNotificationValue = staffMember.textNotifications ? 0 : 1;
      const updatedStaffMember = staffMember.clone();

      updatedStaffMember.textNotifications = newNotificationValue;

      updatedStaffMember.commit();
      updatedStaffMember.patch();
    },
  },
};
</script>
