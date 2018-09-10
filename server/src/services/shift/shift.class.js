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
    const todayishString = moment().subtract(this.termLength - 1, 'days').format('YYYY-MM-DD');

    const { start, end } = params.query;

    let query;

    if (start && end) {
      query = `date >= ${start} && date <= ${end}`;
    } else {
      query = `date >= ${todayishString}`;
    }

    const { shiftsSheet } = await this.getSheets();

    const allShifts =  await shiftsSheet.getRowsAsync({
      query,
      limit: 90,
    });
    
    return allShifts
      .map((shift) => {
        return {
          id: Number(shift.id),
          date: shift.date,
          primary_staff: shift.primarystaff,
          secondary_staff: shift.secondarystaff,
          fulfilled: Number(shift.fulfilled)
        };
      });
  }

  async get (id, params) {
    const { shiftsSheet } = await this.getSheets();

    const shift = await shiftsSheet.getRowsAsync({
      query: `id = ${id}`
    });

    return {
      id: Number(shift[0].id),
      date: shift[0].date,
      primary_staff: shift[0].primarystaff,
      secondary_staff: shift[0].secondarystaff,
      fulfilled: Number(shift[0].fulfilled)
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    return data;
  }

  async update (id, data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.update(current, params)));
    }
    return {id};
  }

  async patch (id, data, params) {
    const { shiftsSheet } = await this.getSheets();

    const [ originalShift ] = await shiftsSheet.getRowsAsync({
      query: `id = ${id}`
    });

    const newShift = {
      primarystaff: data.primary_staff,
      secondarystaff: data.secondary_staff,
    };

    Object.assign(originalShift, newShift);

    await originalShift.save().catch((e) => new Error(e));

    return originalShift;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
