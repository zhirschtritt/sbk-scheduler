<template>
  <v-app id="inspire">
    <v-toolbar dark color="primary" app absolute clipped-left>
      <v-toolbar-title>SBK Schedule</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-title>Today: {{ todaysDate | formatDate }}</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container grid-list-md fluid>
        <v-layout row justify-center>
          <CancelConfirmDialog/>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <TermSelector/>
          </v-flex>
          <v-flex xs12 sm6>
            <StaffMemberTable/>
          </v-flex>
          <v-flex xs12 sm6>
            <ShiftTable/>
          </v-flex>
        </v-layout>
      </v-container>
      <Snackbar/>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import moment from 'moment';
import ShiftTable from './components/ShiftTable.vue';
import StaffMemberTable from './components/StaffMemberTable.vue';
import TermSelector from './components/TermSelector.vue';
import CancelConfirmDialog from './components/CancelConfirmDialog.vue';
import Snackbar from './components/Snackbar.vue';

export default {
  name: 'App',
  components: {
    ShiftTable,
    StaffMemberTable,
    TermSelector,
    CancelConfirmDialog,
    Snackbar
  },

  computed: {
    todaysDate() {
      return new Date();
    }
  },

  methods: {
    ...mapActions('staffMembers', { findStaffMembers: 'find' }),
    ...mapActions('terms', { findTerms: 'find' }),
    ...mapActions(['updateSelectedTerm']),
    ...mapGetters('terms', { findTermsInStore: 'find' }),

    async initialize() {
      await this.findTerms();
      this.findStaffMembers();

      const { data: terms } = this.findTermsInStore()();

      const currentTerm = terms.find(
        term => moment() <= moment(term.end).add(1, 'day')
      );

      this.updateSelectedTerm(currentTerm);
    }
  },

  created() {
    this.initialize();
  }
};
</script>

<style>
</style>
