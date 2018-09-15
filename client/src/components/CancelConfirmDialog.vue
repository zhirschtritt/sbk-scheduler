<template>
  <v-dialog
    v-model="dialog"
    lazy
    max-width="400px"
  >
    <v-card>
      <v-card-title>
        <span>Confirm cancelling shift for {{ currentMemberName | capitalize }}</span>
        <v-spacer/>
      </v-card-title>
      <v-card-actions>
        <v-btn
          color="primary"
          flat
          @click="confirmUpdateShift">Confirm</v-btn>
        <v-btn
          color="primary"
          flat
          @click="cancelUpdate">Go Back</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
import {
  mapState, mapMutations, mapGetters, mapActions,
} from 'vuex';

export default {
  name: 'CancelConfirmDialog',
  methods: {
    ...mapMutations(['toggleCancelShiftDialog']),
    ...mapActions('shifts', [
      'updateShift',
      'rejectUpdateShift',
    ]),

    cancelUpdate() {
      this.toggleCancelShiftDialog();
      this.rejectUpdateShift();
    },

    confirmUpdateShift() {
      this.toggleCancelShiftDialog();
      this.updateShift();
    },
  },
  computed: {
    ...mapState(['cancelShiftDialog']),
    ...mapGetters('members', { getCurrentMember: 'current' }),

    currentMemberName() {
      return this.getCurrentMember ? this.getCurrentMember.name : '';
    },

    dialog: {
      get() {
        return this.cancelShiftDialog;
      },
      set() {
        this.toggleCancelShiftDialog();
      },
    },
  },
};
</script>
