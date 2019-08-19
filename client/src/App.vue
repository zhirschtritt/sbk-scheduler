<template>
  <v-app id="inspire">
    <v-toolbar dark color="primary" app absolute clipped-left>
      <v-toolbar-title>SBK Schedule</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-container>
          <v-btn class="mr-2" to="members" flat text white--text>members</v-btn>
          <v-btn to="staff" flat text white--text>staff</v-btn>
        </v-container>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
    <Snackbar />
  </v-app>
</template>

<script>
import Snackbar from "./components/Snackbar.vue";

export default {
  name: "App",
  components: {
    Snackbar
  },

  mounted: function() {
    this.$router.push("staff");
  },

  computed: {
    todaysDate() {
      return new Date();
    }
  }
};
</script>
