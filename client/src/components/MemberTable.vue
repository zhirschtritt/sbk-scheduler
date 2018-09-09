<template>
  <div>
    <v-toolbar flat>
      <v-toolbar-title>Members</v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="members"
      hide-actions
      flat
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
            {{ shift.date }}
          </v-chip>
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
  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },

  data: () => ({
    headers: [
      { text: 'Member', value: 'name' },
      { text: 'ShiftDates', sortable: false },
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

  },
};
</script>
