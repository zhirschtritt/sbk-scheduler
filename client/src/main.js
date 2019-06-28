import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import 'vuetify/dist/vuetify.min.css';
import App from './App.vue';
import store from './store';
import filters from './filters';
import { router } from './router';

Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.base,
    secondary: '#5C6BC0', // eslint-disable-line
    accent: colors.teal.lighten4,
    error: colors.red.accent3
  }
});

Vue.use(filters);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
