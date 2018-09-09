<template>
  <v-menu>
    <v-chip
      flat
      outline
      label
      :color="fulfilledColor"
      slot="activator">
      {{ staffMemberName }}
    </v-chip>
    <v-list dense>
      <v-list-tile
        @click="setNewStaff('', shift, isPrimary)">
        Clear</v-list-tile>
      <v-divider/>
      <v-list-tile
        v-for="(member, i) in members"
        :key="i"
        @click="setNewStaff(member.name, shift, isPrimary)">
        <v-list-tile-title>{{ member.name }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'MemberSelector',
  props: {
    primary: {
      type: Boolean,
      default: true,
    },
    shift: {
      type: Object,
      default: () => {},
      required: true,
    },
    members: {
      type: Array,
      default: () => [],
      required: true,
    },
    setNewStaff: {
      type: Function,
      default: () => {},
      required: true,
    },
  },

  computed: {
    isPrimary() {
      return this.primary;
    },
    staffMemberName() {
      if (this.primary) {
        return this.shift.primary_staff || 'Add Staff';
      }
      return this.shift.secondary_staff || 'Add Staff';
    },
    fulfilledColor() {
      const staffLevel = this.primary ? 'primary_staff' : 'secondary_staff';

      if (this.shift[staffLevel]) {
        return 'primary';
      }
      return 'grey';
    },
  },
};
</script>
