<template>
  <div>
    <div v-if="(shift.isPastShift && !this.shiftSlotFulfilled) || !shift.shopOpen"/>
    <div v-else>
      <v-menu :disabled="shift.isPastShift" >
        <v-chip
          flat
          outline
          label
          :color="fulfilledColor"
          class="text-capitalize"
          slot="activator">
          {{ staffMemberName }}
        </v-chip>
        <v-list dense>
          <div v-if="this.shiftSlotFulfilled">
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
            <v-list-tile-title class="text-capitalize">{{ member.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MemberSelector',
  props: {
    isPrimary: {
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
    staffMemberName() {
      if (this.isPrimary) {
        return this.shift.primary_staff || 'Add Staff';
      }
      return this.shift.secondary_staff || 'Add Staff';
    },
    shiftSlotFulfilled() {
      const staffLevel = this.isPrimary ? 'primary_staff' : 'secondary_staff';

      return !!this.shift[staffLevel];
    },
    fulfilledColor() {
      if (this.shiftSlotFulfilled && !this.shift.isPastShift) {
        return 'primary';
      }
      return 'grey';
    },
  },
};
</script>
