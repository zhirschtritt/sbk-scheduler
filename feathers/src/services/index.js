const term = require('./term/term.service.js');
const member = require('./member/member.service.js');
const shift = require('./shift/shift.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(term);
  app.configure(member);
  app.configure(shift);
};
