import {BaseService} from '../interfaces';
import {Shift} from './shift.interfaces';
import moment from 'moment';

export type IShiftService = BaseService<Shift> & {findByDateRange(from: Date, to: Date): Promise<Shift[]>};

class ShiftService implements IShiftService {
  private readonly termLength: any;
  private readonly sheets: any;
  constructor({sheets, termLength}: any) {
    this.termLength = termLength;
    this.sheets = sheets;
  }

  async getSheets() {
    const sheets = await this.sheets.getInfoAsync();
    const shiftsSheet = sheets.worksheets.filter((sheet: any) => sheet.title === 'Shifts');
    return {
      shiftsSheet: (Promise as any).promisifyAll(shiftsSheet[0]),
      sheetId: shiftsSheet.id,
    };
  }

  async findByDateRange(from: Date, to: Date) {
    const {shiftsSheet} = await this.getSheets();
    const [fromDate, toDate] = [from, to].map(d => formatDateForQuery(d));

    const allShifts = await shiftsSheet.getRowsAsync({
      query: `date >= ${fromDate} && date <= ${toDate}`,
    });

    return allShifts.map((shift: any) => shiftEntityToModel(shift));
  }

  async find() {
    const {shiftsSheet} = await this.getSheets();

    const todayishString = moment()
      .subtract(this.termLength - 1, 'days')
      .format('YYYY-MM-DD');

    const allShifts = await shiftsSheet.getRowsAsync({
      query: `date >= ${todayishString}`,
      limit: 90,
    });

    return allShifts.map((shift: any) => shiftEntityToModel(shift));
  }

  async get(id: string) {
    const {shiftsSheet} = await this.getSheets();

    const [shift] = await shiftsSheet.getRowsAsync({
      query: `id = ${id}`,
    });

    return shiftEntityToModel(shift);
  }

  async patch(id: string, data: Partial<Shift>) {
    const {shiftsSheet} = await this.getSheets();

    const [shift] = await shiftsSheet.getRowsAsync({
      query: `id = ${id}`,
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
      throw new Error(err);
    }

    return shiftEntityToModel(shift);
  }
}

function formatDateForQuery(date: Date): string {
  return moment(date).format('YYYY-MM-DD');
}

export function shiftEntityToModel(shift: any): Shift {
  return {
    id: +shift.id,
    date: shift.date,
    primary_staff: shift.primarystaff,
    secondary_staff: shift.secondarystaff,
    fulfilled: +shift.fulfilled,
    updatedAt: shift.updatedat,
    shop_open: +shift.shopopen,
  };
}

module.exports = function(options: any) {
  return new ShiftService(options);
};

module.exports.Service = ShiftService;
