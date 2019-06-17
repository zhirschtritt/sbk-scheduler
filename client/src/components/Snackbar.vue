<template>
  <v-snackbar v-model="snackbar" :color="snackbarColor" align-center bottom>
    {{ snackbarText }}
    <v-icon @click="hideSnackbar" right color="white">close</v-icon>
  </v-snackbar>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
export default {
  methods: {
    ...mapMutations(['hideSnackbar'])
  },
  computed: {
    ...mapState(['snackbarText', 'snackbarColor', 'snackbarVisable']),

    snackbar: {
      set() {
        this.hideSnackbar;
      },
      get() {
        return this.snackbarVisable;
      }
    }
  }
};
</script>
