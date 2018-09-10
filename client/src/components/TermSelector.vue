<template>
  <v-flex
    sm6
    xs12
    offset-sm3
  >
    <v-toolbar
      dark
      color="primary"
      dense
      flat>
      <v-icon>date_range</v-icon>
      <v-toolbar-title>Term</v-toolbar-title>
    </v-toolbar>
    <v-select
      flat
      solo
      :items="terms"
      label="Term"
      return-object
      :value="getCurrentTerm"
      @input="updateSelectedTerm"
    />
  </v-flex>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import formatDate from '../filters/formatDate';

export default {
  computed: {
    ...mapGetters('terms', { findTermsInStore: 'find' }),
    ...mapGetters('terms', { getCurrentTerm: 'current' }),

    terms() {
      const terms = this.findTermsInStore().data;

      return terms.map(term => Object.assign(term, {
        text: `${formatDate(term.start)} - ${formatDate(term.end)}`,
      }));
    },
  },

  methods: {
    ...mapMutations('terms', { setCurrentTerm: 'setCurrent' }),
    ...mapMutations('shifts', { clearAllShifts: 'clearAll' }),
    ...mapActions('shifts', { findShifts: 'find' }),

    updateSelectedTerm(term) {
      this.setCurrentTerm(term);

      const { start, end } = this.getCurrentTerm;

      this.clearAllShifts();
      this.findShifts({ query: { start, end } });
    },
  },
};
</script>
