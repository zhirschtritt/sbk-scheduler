<template>
  <v-snackbar v-model="snackbar" :color="color" align-center bottom>
    {{ text }}
    <v-icon @click="hide" right color="white">close</v-icon>
  </v-snackbar>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters, mapMutations, mapState } = createNamespacedHelpers('snackBar');
export default {
  methods: {
    ...mapMutations(['hide'])
  },
  computed: {
    ...mapState(['text', 'color', 'visable']),

    snackbar: {
      set() {
        this.hide();
      },
      get() {
        return this.visable;
      }
    }
  }
};
</script>
