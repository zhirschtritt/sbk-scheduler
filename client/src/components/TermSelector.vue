<template>
  <v-flex
    sm6
    xs12
    offset-sm3
  >
    <v-select
      outline
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

export default {
  computed: {
    ...mapGetters('terms', { findTermsInStore: 'find' }),
    ...mapGetters('terms', { getCurrentTerm: 'current' }),

    terms() {
      const terms = this.findTermsInStore().data;

      return terms.map(term => Object.assign(term, {
        value: `${term.start} - ${term.end}`,
        text: `${term.start} - ${term.end}`,
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
