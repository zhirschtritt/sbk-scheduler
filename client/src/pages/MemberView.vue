<template>
  <v-container grid-list-md fluid>
    <v-layout row justify-center>
      <v-flex xs12>
        <MemberTable/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MemberTable from '../components/MemberTable.vue';
import { mapActions } from 'vuex';
export default {
  components: {
    MemberTable
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
