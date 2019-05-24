<template>
  <v-dialog v-model="dialogWindow" lazy max-width="450px">
    <v-card>
      <v-card-title primary-title mx-2>
        <h3 class="subheading">
          Confirm cancelling shift for
          {{ currentStaffMemberName | capitalize }}
          on {{ shiftDate | formatDateWithWeekday }}
        </h3>
        <span class="caption font-weight-thin">
          By cancelling this shift, an email will be sent to SBK staff to inform them
          that this shift is now available. Please add a message for staff to include in
          the email.
        </span>
      </v-card-title>
      <v-spacer/>
      <v-form ref="form" v-model="form" class="mx-4">
        <v-textarea
          v-model="emailMessage"
          auto-grow
          box
          row-height="18"
          label="Message to staff"
          persistent
          autofocus
          color="primary"
          :rules="[rules.required]"
        />
        <v-card-actions>
          <v-btn
            :disabled="!form"
            :loading="notificationLoading"
            color="primary"
            flat
            @click="confirmUpdateShift"
          >Confirm and Send Notification</v-btn>
          <v-btn
            v-if="$vuetify.breakpoint.smAndUp"
            color="primary"
            flat
            @click="cancelUpdate"
          >Go Back</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'CancelConfirmDialog',
  data: () => ({
    form: false,
    emailMessage: '',
    rules: {
      required: v => !!v || 'This field is required',
    },
  }),
  methods: {
    ...mapActions(['toggleCancelShiftDialog']),
    ...mapActions('shifts', ['updateShift', 'rejectUpdateShift']),
    ...mapActions('notifications', { createNotification: 'create' }),

    cancelUpdate() {
      this.toggleCancelShiftDialog();
      this.rejectUpdateShift();
    },

    async confirmUpdateShift() {
      try {
        await this.createNotification({
          notificationType: 'cancelledShift',
          context: {
            customMessage: JSON.stringify(this.emailMessage),
            shift: this.shift,
            staffMember: this.getCurrentStaffMember,
          },
        });
      } catch (err) {
        console.error('Could not create new notification');
        throw err;
      }

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
