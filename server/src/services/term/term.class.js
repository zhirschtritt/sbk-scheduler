/* eslint-disable no-unused-vars */
const moment = require('moment');

class Service {
  constructor ({ paginate, sheets, termLength }) {
    this.paginate = paginate;
    this.termLength = termLength;
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
    const todayishString = moment().subtract(this.termLength - 1, 'days').format('YYYY-MM-DD');

    const allTerms =  await termsSheet.getRowsAsync({
      query: `start >= ${todayishString}`
    });

    return allTerms
      .map((term) => {
        return {
          id: Number(term.id),
          start: term.start,
          end: term.end
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
      end: term[0].end
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
