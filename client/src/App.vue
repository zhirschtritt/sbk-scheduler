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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ShiftTable from './components/ShiftTable.vue';
import MemberTable from './components/MemberTable.vue';
import TermSelector from './components/TermSelector.vue';

export default {
  name: 'App',
  components: {
    ShiftTable,
    MemberTable,
    TermSelector,
  },

  computed: {
    todaysDate() {
      return new Date();
    },
  },

  methods: {
    ...mapActions('shifts', { findShifts: 'find' }),
    ...mapActions('members', { findMembers: 'find' }),
    ...mapActions('terms', { findTerms: 'find' }),

    ...mapGetters('terms', { getCurrentTerm: 'current' }),
    ...mapMutations('terms', { setCurrentTerm: 'setCurrent' }),

    async initialize() {
      await this.findTerms();
      this.setCurrentTerm(1);

      const { start, end } = this.getCurrentTerm();

      this.findShifts({ query: { start, end } });
      this.findMembers();
    },
  },

  created() {
    this.initialize();
  },
};
</script>

<style>
</style>
