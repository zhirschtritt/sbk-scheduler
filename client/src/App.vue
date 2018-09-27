<template>
  <v-app
    id="inspire"
  >
    <v-toolbar
      dark
      color="primary"
      app
      absolute
      clipped-left>
      <v-toolbar-title>SBK Schedule</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-title>Today: {{ todaysDate | formatDate }}</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container
        grid-list-md
        fluid>
        <v-layout
          row
          justify-center>
          <CancelConfirmDialog/>
        </v-layout>
        <v-layout
          row
          wrap>
          <v-flex
            xs12
          >
            <TermSelector/>
          </v-flex>
          <v-flex
            xs12
            sm6>
            <MemberTable/>
          </v-flex>
          <v-flex
            xs12
            sm6>
            <ShiftTable/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ShiftTable from './components/ShiftTable.vue';
import MemberTable from './components/MemberTable.vue';
import TermSelector from './components/TermSelector.vue';
import CancelConfirmDialog from './components/CancelConfirmDialog.vue';

export default {
  name: 'App',
  components: {
    ShiftTable,
    MemberTable,
    TermSelector,
    CancelConfirmDialog,
  },

  computed: {
    todaysDate() {
      return new Date();
    },
  },

  methods: {
    ...mapActions('members', { findMembers: 'find' }),
    ...mapActions('terms', { findTerms: 'find' }),
    ...mapActions(['updateSelectedTerm']),
    ...mapGetters('terms', { findTermsInStore: 'find' }),

    async initialize() {
      await this.findTerms();
      this.findMembers();

      const { data: [currentTerm] } = this.findTermsInStore()({
        query: { isCurrent: true },
      });

      this.updateSelectedTerm(currentTerm);
    },
  },

  created() {
    this.initialize();
  },
};
</script>

<style>
</style>
