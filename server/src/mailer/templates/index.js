const fs = require('fs');
const path = require('path');

module.exports = function(templateName) {
  return fs.readFileSync(path.join(__dirname, `${templateName}.hbs`), 'utf8');
};
