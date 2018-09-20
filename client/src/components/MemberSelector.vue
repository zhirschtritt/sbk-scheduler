<template>
  <v-menu :disabled="isPastShift">
    <v-chip
      flat
      outline
      label
      :color="fulfilledColor"
      slot="activator">
      {{ staffMemberName | capitalize }}
    </v-chip>
    <v-list dense>
      <div v-if="canBeCleared">
        <v-list-tile
          @click="setNewStaff('', shift, isPrimary)">
          <strong>Clear</strong>
        </v-list-tile>
        <v-divider/>
      </div>
      <v-list-tile
        v-for="(member, i) in members"
        :key="i"
        @click="setNewStaff(member.name, shift, isPrimary)">
        <v-list-tile-title>{{ member.name | capitalize }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';

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
    ...mapState('shifts', ['isPatchPending']),
    shiftPatchPending() {
      return this.isPatchPending;
    },
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

      if (this.shift[staffLevel] && !this.isPastShift) {
        return 'primary';
      }
      return 'grey';
    },
    canBeCleared() {
      if ((this.primary && this.shift.primary_staff)
      || (!this.primary && this.shift.secondary_staff)) {
        return true;
      }
      return false;
    },
    isPastShift() {
      const shiftEndOfDay = moment(this.shift.date).add(24, 'hours');
      const now = moment();

      if (now.isAfter(shiftEndOfDay)) {
        return true;
      }
      return false;
    },
  },
};
</script>
