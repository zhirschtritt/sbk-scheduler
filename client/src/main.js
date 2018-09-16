import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import 'vuetify/dist/vuetify.min.css';
import App from './App.vue';
import store from './store';
import filters from './filters';

Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.base,
    secondary: colors.purple.base, // eslint-disable-line
    accent: colors.teal.accent2,
    error: colors.red.accent3,
  },
});

Vue.use(filters);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
