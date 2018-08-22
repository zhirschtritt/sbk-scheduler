<template>
  <v-app id="inspire">
    <v-toolbar
      app
      absolute
      clipped-left>
      <span class="title ml-3 mr-5">SBK Schedule</span>
      <v-spacer/>
    </v-toolbar>
    <v-content>
      <v-container
        fluid
        fill-height
        class="grey lighten-4">
        <v-layout
          justify-center
          align-center>
          <ShiftTable/>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import ShiftTable from './components/ShiftTable.vue';

export default {
  name: 'App',
  components: {
    ShiftTable,
  },
};
</script>

<style>
</style>
