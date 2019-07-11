<template>
  <v-container grid-list-md fluid>
    <v-layout row justify-center>
      <RenewMembershipDiaglog />
    </v-layout>
    <v-layout row justify-center>
      <v-flex xs12>
        <MemberTable />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MemberTable from '../components/MemberTable.vue';
import RenewMembershipDiaglog from '../components/RenewMembershipDialog.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: {
    MemberTable,
    RenewMembershipDiaglog
  },
  methods: {
    ...mapActions('members', { findMembers: 'find' }),

    async initialize() {
      await this.findMembers();
    }
  },

  created() {
    this.initialize();
  }
};
</script>
