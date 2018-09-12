const moment = require('moment');
const Handlebars = require('handlebars');

Handlebars.registerHelper('formatDate', function(date) {
  return moment(date).format('ddd, MMM D, YYYY');
});

Handlebars.registerHelper('capitalize', function(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});

module.exports = Handlebars;
