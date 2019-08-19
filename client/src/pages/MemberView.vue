<template>
  <v-container grid-list-md fluid>
    <v-layout row justify-center>
      <RenewMembershipDialog />
      <MemberEditDialog />
    </v-layout>
    <v-layout row justify-center>
      <v-flex xs12>
        <MemberTable />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MemberTable from "../components/MemberTable.vue";
import RenewMembershipDialog from "../components/RenewMembershipDialog.vue";
import MemberEditDialog from "../components/MemberEditDialog.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  components: {
    MemberTable,
    RenewMembershipDialog,
    MemberEditDialog
  },
  methods: {
    ...mapActions("members", { findMembers: "find" }),

    async initialize() {
      await this.findMembers();
    }
  },

  created() {
    this.initialize();
  }
};
</script>
