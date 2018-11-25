<template>
  <v-dialog
    v-model="dialogWindow"
    lazy
    max-width="450px"
  >
    <v-card>
      <v-card-title
        primary-title
        mx-2>
        <h3 class="subheading">Confirm cancelling shift for
          {{ currentStaffMemberName | capitalize }}
          on {{ shiftDate | formatDateWithWeekday }}
        </h3>
        <span class="caption font-weight-thin">
          By cancelling this shift, an email will be sent to SBK staff to inform them
          that this shift is now available. You can add a personalized message to include in
          the email below.
        </span>
      </v-card-title>
      <v-spacer/>
      <v-form
        ref="form"
        class="mx-4"
      >
        <v-textarea
          v-model="emailMessage"
          auto-grow
          box
          row-height=18
          label="Custom message to staff"
          persistent
          autofocus
          color="primary"
        />
        <v-card-actions>
          <v-btn
            :loading="notificationLoading"
            color="primary"
            flat
            @click="confirmUpdateShift">Confirm and Send Notification</v-btn>
          <v-btn
            v-if="$vuetify.breakpoint.smAndUp"
            color="primary"
            flat
            @click="cancelUpdate">Go Back</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

  </v-dialog>
</template>

<script>
import {
  mapState, mapGetters, mapActions,
} from 'vuex';

export default {
  name: 'CancelConfirmDialog',
  data: () => ({
    emailMessage: '',
  }),
  methods: {
    ...mapActions(['toggleCancelShiftDialog']),
    ...mapActions('shifts', [
      'updateShift',
      'rejectUpdateShift',
    ]),

    cancelUpdate() {
      this.toggleCancelShiftDialog();
      this.rejectUpdateShift();
    },

    async confirmUpdateShift() {
      const { Notification } = this.$FeathersVuex;

      const notification = new Notification({
        message: JSON.stringify(this.emailMessage),
        notificationType: 'cancelledShift',
        context: {
          shift: this.shift,
          staffMember: this.getCurrentStaffMember,
        },
      });

      await notification.save();

      this.emailMessage = '';
      this.toggleCancelShiftDialog();
      this.updateShift();
    },
  },
  computed: {
    ...mapState(['cancelShiftDialog']),
    ...mapGetters('staffMembers', { getCurrentStaffMember: 'current' }),
    ...mapGetters('shifts', { getCurrentShift: 'current' }),
    ...mapState('notifications', { notificationLoading: 'isCreatePending' }),

    shift() {
      return this.getCurrentShift;
    },

    shiftDate() {
      return this.getCurrentShift ? this.getCurrentShift.date : '';
    },

    currentStaffMemberName() {
      return this.getCurrentStaffMember ? this.getCurrentStaffMember.name : '';
    },

    dialogWindow: {
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
