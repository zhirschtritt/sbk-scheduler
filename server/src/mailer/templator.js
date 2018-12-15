const moment = require('moment');
const Handlebars = require('handlebars');

Handlebars.registerHelper('formatDate', function(date) {
  return moment(date).format('dddd, MMM D, YYYY');
});

Handlebars.registerHelper('capitalize', function(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Handlebars.registerHelper('replaceLineBreaks', function(value) {
  return JSON.parse(value).replace(/\n/g, '<br />' );
});

module.exports = Handlebars;
