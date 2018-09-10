import capitalize from './capitalize';
import formatDate from './formatDate';
import formatDateWithWeekday from './formatDateWithWeekday';

export default {
  install(Vue) {
    Vue.filter('capitalize', capitalize);
    Vue.filter('formatDate', formatDate);
    Vue.filter('formatDateWithWeekday', formatDateWithWeekday);
  },
};
