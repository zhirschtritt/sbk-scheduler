<template>
  <v-data-table :headers="headers" :items="members" hide-actions dense :loading="areMembersLoading">
    <template slot="no-data">Loading...</template>
    <template slot="items" slot-scope="{item: member}">
      <td class="text-capitalize pr-1">{{ member.name }}</td>
      <td>{{ member.memberSince | formatDate }}</td>
      <td>{{ member.term.end | formatDate }}</td>
      <v-layout align-center justify-center column class="pt-3">
        <LabeledSwitch
          :switchPredicate="!!member.email"
          :switchValue="!!member.emailNotifications"
          :switchAction="() => updateNotifications(member, 'emailNotifications')"
          switchLabel="Email Notifications"
          color="primary"
          icon="fa-envelope-o"
        />
        <LabeledSwitch
          :switchPredicate="!!member.phoneNumber"
          :switchValue="!!member.smsNotifications"
          :switchAction="() => updateNotifications(member, 'smsNotifications')"
          switchLabel="Text Notifications"
          color="secondary"
          icon="fa-commenting-o"
        />
      </v-layout>
      <td class="pl0">
        <v-btn
          flat
          color="primary"
          :disabled="!isAbleToRenew(member)"
          @click="() => renew(member)"
        >renew membership</v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import LabeledSwitch from '../components/LabeledSwitch.vue';
export default {
  components: {
    LabeledSwitch
  },
  data: () => ({
    headers: [
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Member Since', value: 'memberSince', align: 'left' },
      { text: 'Current Term End', value: 'currentTerm', align: 'left' },
      { text: 'Notifications', value: 'notifications', align: 'left' },
      { text: 'Renew', value: 'renew', align: 'left' }
    ]
  }),

  computed: {
    ...mapState('members', { areMembersLoading: 'isFindPending' }),
    ...mapGetters('members', { findMembersInStore: 'find' }),

    members() {
      return this.findMembersInStore().data;
    }
  },

  methods: {
    ...mapMutations('snackBar', { showSnackbar: 'show' }),
    ...mapMutations('members', { setCurrentMember: 'setCurrent' }),
    ...mapMutations('renewMembershipDialog', {
      showRenewMembershipDialog: 'show'
    }),

    isAbleToRenew(member) {
      const currentTermEnd = moment.utc(member.term.end);
      const sixMonthsFromNow = moment.utc().add(6, 'months');
      return currentTermEnd.isSameOrBefore(sixMonthsFromNow, 'days');
    },

    async renew(member) {
      this.setCurrentMember(member);
      this.showRenewMembershipDialog();
    },

    async updateNotifications(member, notificationType) {
      const newNotificationValue = member[notificationType] ? 0 : 1;
      const updatedMember = member.clone();

      updatedMember[notificationType] = newNotificationValue;

      updatedMember.commit();
      try {
        await updatedMember.patch();
        this.showSnackbar({
          text: 'Notification preferences updated',
          color: 'primary'
        });
      } catch (err) {
        this.showSnackbar({
          text: 'Error updating notification preferences',
          color: 'secondary'
        });
        throw err;
      }
    }
  }
};
</script>
