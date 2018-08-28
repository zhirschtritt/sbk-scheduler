<template>
  <div>
    <v-toolbar
      flat
      color="white">
      <v-toolbar-title>Volunteer Schedule</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      />
      <v-spacer/>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="shifts"
      hide-actions
      flat
      :loading="areShiftsLoading"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>{{ props.item.date }}</td>
        <td
          class="text-xs-right"
        >
          <v-menu>
            <v-btn
              flat
              slot="activator">{{ props.item.primary_staff }}</v-btn>
            <v-list dense>
              <v-list-tile
                @click="setNewStaff('', props.item, 'primary')">
                Clear</v-list-tile>
              <v-divider/>
              <v-list-tile
                v-for="(member, i) in members"
                :key="i"
                @click="setNewStaff(member.name, props.item, 'primary')">
                <v-list-tile-title>{{ member.name }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
        <td class="text-xs-right">
          <v-menu>
            <v-btn
              flat
              slot="activator">{{ props.item.secondary_staff }}</v-btn>
            <v-list dense>
              <v-list-tile
                @click="setNewStaff('', props.item, 'secondary')">
                Clear</v-list-tile>
              <v-divider/>
              <v-list-tile
                v-for="(member, i) in members"
                :key="i"
                @click="setNewStaff(member.name, props.item, 'secondary')">
                <v-list-tile-title>{{ member.name }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
      </template>
      <template slot="no-data">
        No data
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {

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
    setNewStaff(memberName, shift, staffLevel) {
      const updateShift = shift.clone();
      // TODO: clean up
      // If primary staff position not filled, save as primary staff
      if (staffLevel === 'primary') {
        updateShift.primary_staff = memberName;
      } else {
        updateShift.secondary_staff = memberName;
      }

      updateShift.commit();
      updateShift.patch();
    },
  },
};
</script>
