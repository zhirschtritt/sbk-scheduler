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
        <td>{{ props.item.date | formatDateWithWeekday }}</td>
        <td>
          <MemberSelector
            :shift="props.item"
            :members="members"
            :set-new-staff="setNewStaff"
            :primary="true"
          />
        </td>
        <td>
          <MemberSelector
            :shift="props.item"
            :members="members"
            :set-new-staff="setNewStaff"
            :primary="false"
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
    setNewStaff(memberName, shift, isPrimary) {
      const updateShift = shift.clone();

      if (isPrimary) {
        updateShift.primary_staff = memberName;
      } else {
        updateShift.secondary_staff = memberName;
      }

      updateShift.fulfilled = (updateShift.primary_staff || updateShift.secondary_staff) ? 1 : 0;

      updateShift.commit();
      updateShift.patch();
    },
  },
};
</script>
