<template>
  <v-flex
    sm6
    xs12
    offset-sm3
  >
    <v-select
      :items="terms"
      label="Term"
      max-width="200px"
      return-object
      :value="getCurrentTerm"
      @input="setCurrentTerm"
    />
  </v-flex>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapGetters('terms', { findTermsInStore: 'find' }),
    ...mapGetters('terms', { getCurrentTerm: 'current' }),

    selectedTerm() {
      return this.getCurrentTerm();
    },

    terms() {
      const terms = this.findTermsInStore().data;

      return terms.map(term => Object.assign(term, {
        value: `${term.start} - ${term.end}`,
        text: `${term.start} - ${term.end}`,
      }));
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapMutations('terms', { setCurrentTerm: 'setCurrent' }),

    initialize() {
      this.setCurrentTerm(1);
    },
  },
};
</script>
