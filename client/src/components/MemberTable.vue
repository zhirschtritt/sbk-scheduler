<template>
  <div>
    <v-toolbar
      flat
      color="white">
      <v-toolbar-title>Members</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      />
      <v-spacer/>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="members"
      hide-actions
      flat
      :loading="areMembersLoading"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>{{ props.item.name | capitalize }}</td>
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
  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },

  data: () => ({
    headers: [
      { text: 'Member', value: 'name' },
    ],
  }),

  computed: {
    ...mapState('members', { areMembersLoading: 'isFindPending' }),
    ...mapGetters('shifts', { findShiftsInStore: 'find' }),
    ...mapGetters('members', { findMembersInStore: 'find' }),
    shifts() {
      return this.findShiftsInStore().data;
    },
    members() {
      return this.findMembersInStore().data;
    },
  },
  created() {
    // this.initialize();
  },

  methods: {
    initialize() {
    },

  },
};
</script>
