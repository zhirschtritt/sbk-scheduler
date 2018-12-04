/* eslint-disable no-unused-vars */
const moment = require('moment');

class Service {
  constructor ({ paginate, sheets }) {
    this.paginate = paginate;
    this.sheets = sheets;
  }

  async getSheets () {
    const sheets = await this.sheets.getInfoAsync();
    let termsSheet = sheets.worksheets.filter((sheet) => sheet.title === 'Terms');
    return {
      termsSheet: Promise.promisifyAll(termsSheet[0]),
      sheetId: termsSheet.id
    };
  }

  async find (params) {
    const { termsSheet } = await this.getSheets();

    const allTerms = await termsSheet.getRowsAsync({});

    return allTerms
      .map((term) => {
        return {
          id: Number(term.id),
          start: term.start,
          end: term.end,
        };
      });
  }

  async get (id, params) {
    const { termsSheet } = await this.getSheets();

    const term = await termsSheet.getRowsAsync({
      query: `id = ${id}` 
    }); 

    return {
      id: Number(term[0].id),
      start: term[0].start,
      end: term[0].end,
    };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
