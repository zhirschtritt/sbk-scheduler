<template>
  <v-data-table :headers="headers" :items="members" hide-actions dense :loading="areMembersLoading">
    <template slot="no-data">Loading...</template>
    <template slot="items" slot-scope="props">
      <td class="text-capitalize pr-1">{{ props.item.name }}</td>
      <td>{{ props.item.memberSince | formatDate }}</td>
      <td>{{ props.item.term.start | formatDate }} - {{ props.item.term.end | formatDate }}</td>
      <v-layout align-center justify-center column class="pt-3">
        <LabeledSwitch
          :switchPredicate="true"
          :switchValue="props.item.emailNotifications"
          :switchAction="() => updateNotifications(props.item, 'emailNotifications')"
          switchLabel="Email Notifications"
          color="primary"
          icon="fa-envelope-o"
        />
        <LabeledSwitch
          :switchPredicate="props.item.phoneNumber"
          :switchValue="props.item.textNotifications"
          :switchAction="() => updateNotifications(props.item, 'smsNotifications')"
          switchLabel="Text Notifications"
          color="secondary"
          icon="fa-commenting-o"
        />
      </v-layout>
      <td class="pl0">
        <v-btn flat color="primary">renew membership</v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
import LabeledSwitch from '../components/LabeledSwitch.vue';
export default {
  components: {
    LabeledSwitch
  },
  data: () => ({
    headers: [
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Member Since', value: 'memberSince', align: 'left' },
      { text: 'Current Term', value: 'currentTerm', align: 'left' },
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
