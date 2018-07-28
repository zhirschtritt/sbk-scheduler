const GoogleSpreadsheet = require('google-spreadsheet');

module.exports = function (app) {
  const sheet = app.get('googleSheetId');
  const googleSheets = new GoogleSpreadsheet(sheet);
  const sheets = Promise.promisifyAll(googleSheets);
  
  app.set('sheetsClient', sheets);
};