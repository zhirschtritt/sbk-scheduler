<template>
  <v-app id="inspire">
    <v-toolbar dark color="primary" app absolute clipped-left>
      <v-toolbar-title>SBK Schedule</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-title>Today: {{ todaysDate | formatDate }}</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <Snackbar/>
  </v-app>
</template>

<script>
import Snackbar from './components/Snackbar.vue';

export default {
  name: 'App',
  components: {
    Snackbar
  },

  computed: {
    todaysDate() {
      return new Date();
    }
  }
};
</script>
