// /* eslint-disable @typescript-eslint/camelcase */
// import GoogleSpreadsheet from 'google-spreadsheet';

// export default async function(app) {
//   const sheet = app.get('googleSheetId');
//   const googleSheets = new GoogleSpreadsheet(sheet);
//   const sheets = Promise.promisifyAll(googleSheets);

//   const private_key = Buffer.from(app.get('iam_private_key_base64'), 'base64').toString('ascii');

//   const creds = {
//     client_email: app.get('iam_client_email'),
//     private_key,
//   };

//   sheets.useServiceAccountAuthAsync(creds);

//   app.set('sheetsClient', sheets);
// }
