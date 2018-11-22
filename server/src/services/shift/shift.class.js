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

    let googleSheetsQuery;

    if (start && end) {
      googleSheetsQuery = `date >= ${start} && date <= ${end}`;
    } else {
      googleSheetsQuery = `date >= ${todayishString}`;
    }

    const { shiftsSheet } = await this.getSheets();

    const allShifts =  await shiftsSheet.getRowsAsync({
      query: googleSheetsQuery,
      limit: 90,
    });
    
    return allShifts
      .map((shift) => {
        return {
          id: Number(shift.id),
          date: shift.date,
          primary_staff: shift.primarystaff,
          secondary_staff: shift.secondarystaff,
          fulfilled: Number(shift.fulfilled),
          updatedAt: shift.updatedat,
          shopOpen: Number(shift.shopopen),
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
      fulfilled: Number(shift[0].fulfilled),
      updatedAt: shift.updatedat,
      shopOpen: Number(shift.shopopen),
    };
  }

  async patch (id, data, params) {
    const { shiftsSheet } = await this.getSheets();

    const [ shift ] = await shiftsSheet.getRowsAsync({
      query: `id = ${id}`
    });

    const updatedShiftData = {
      primarystaff: data.primary_staff,
      secondarystaff: data.secondary_staff,
      fulfilled: data.fulfilled,
      updatedat: moment().format('YYYY-MM-DDTHH:mm:ss'), // kinda ISO8601
    };

    Object.assign(shift, updatedShiftData);

    try { 
      shift.save();
    } catch (err) {
      return new Error(err);
    }

    return {
      id: Number(shift.id),
      date: shift.date,
      primary_staff: shift.primarystaff,
      secondary_staff: shift.secondarystaff,
      fulfilled: Number(shift.fulfilled),
      updatedAt: shift.updatedat,
    };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
