const drive = require('drive-db');
const GoogleSpreadsheet = require('google-spreadsheet');

module.exports = function (app) {
  const sheet = app.get('googleSheetId');
  const cache = app.get('maxCacheTime');

  const googleSheets = new GoogleSpreadsheet(sheet);

  const sheets = Promise.promisifyAll(googleSheets);
  
  app.set('sheetsClient', sheets);
  app.set('driveClient', drive({ sheet, cache }))
}