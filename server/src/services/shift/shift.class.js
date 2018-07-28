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
    let shiftsSheet = sheets.worksheets.filter((sheet) => sheet.title === 'Shifts');
    return {
      shiftsSheet: Promise.promisifyAll(shiftsSheet[0]),
      sheetId: shiftsSheet.id
    };
  }

  async find (params) {
    let query = `date >= ${todayishString}`;

    const { shiftsSheet } = await this.getSheets();
    const todayishString = moment()
      .subtract(this.termLength - 1, 'days').format('YYYY-MM-DD');

    const allShifts =  await shiftsSheet.getRowsAsync({
      query,
      limit: 100,
      skip: params.query.skip
    });
    
    return allShifts
      .map((shift) => {
        return {
          id: shift.id,
          date: shift.date,
          primary_staff: shift.primarystaff,
          secondary_staff: shift.secondarystaff,
          fufilled: shift.fulfilled
        };
      });
  }

  async get (id, params) {
    const { shiftsSheet } = await this.getSheets();

    const shift = await shiftsSheet.getRowsAsync({
      query: `id = ${id}`
    });

    return {
      id: shift[0].id,
      date: shift[0].date,
      primary_staff: shift[0].primarystaff,
      secondary_staff: shift[0].secondarystaff,
      fufilled: shift[0].fulfilled
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
