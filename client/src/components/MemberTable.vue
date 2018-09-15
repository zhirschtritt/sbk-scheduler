<template>
  <div>
    <v-toolbar
      dark
      color="primary"
      dense
      flat>
      <v-icon>people</v-icon>
      <v-toolbar-title>Members</v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="members"
      hide-actions
      dense
      :loading="areMembersLoading"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>{{ props.item.name | capitalize }}</td>
        <td>
          <v-chip
            label
            outline
            color="primary"
            :key="shift.id"
            v-for="shift in shiftsForMember(props.item.name)"
          >
            {{ shift.date | formatDateWithWeekday }}
          </v-chip>
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
      </template>
      <template slot="no-data">
        Loading...
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data: () => ({
    headers: [
      { text: 'Member', value: 'name' },
      { text: 'Scheduled Shifts', sortable: false },
      { text: 'Shift Reminders', sortable: false },
    ],
  }),

  computed: {
    ...mapState('members', { areMembersLoading: 'isFindPending' }),
    ...mapGetters('shifts', { findShiftsInStore: 'find' }),
    ...mapGetters('members', { findMembersInStore: 'find' }),

    members() {
      return this.findMembersInStore().data;
    },
  },

  methods: {
    shiftsForMember(memberName) {
      const query = {
        $or: [
          { primary_staff: memberName },
          { secondary_staff: memberName },
        ],
      };
      return this.findShiftsInStore({ query }).data;
    },

    updateNotifications(member) {
      const newNotificationValue = member.notifications ? 0 : 1;
      const updatedMember = member.clone();

      updatedMember.notifications = newNotificationValue;

      updatedMember.commit();
      updatedMember.patch();
    },
  },
};
</script>
