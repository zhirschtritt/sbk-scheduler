import {BaseService} from '../interfaces';
import {Shift} from './shift.interfaces';
import moment from 'moment';
import {logger} from '../../logger';
import {ShiftRepository} from './ShiftRepository';

export type IShiftService = BaseService<Shift> & {
  findByDateRange(from: Date, to: Date): Promise<Shift[]>;
};
export class ShiftService implements IShiftService {
  constructor(private readonly repository: ShiftRepository) {}

  async find(params: {query: {start: Date; end: Date}}) {
    const start = params.query.start || new Date();
    const end =
      params.query.end ||
      moment()
        .add(90, 'days')
        .toDate();

    return await this.findByDateRange(start, end);
  }

  async get(id: string) {
    const shift = await this.repository.findOneById(id);

    return shiftEntityToModel(shift);
  }

  async patch(id: string, data: Partial<Shift>) {
    const shift = await this.repository.findOneById(id);

    const updatedShiftData = {
      primarystaff: data.primary_staff,
      secondarystaff: data.secondary_staff,
      fulfilled: data.fulfilled,
      updatedat: moment().format('YYYY-MM-DDTHH:mm:ss'), // kinda ISO8601
    };

    Object.assign(shift, updatedShiftData);

    try {
      await shift.save();
    } catch (err) {
      logger.error('error updating shift');
      throw err;
    }

    return shiftEntityToModel(shift);
  }

  async findByDateRange(from: Date, to: Date) {
    const allShifts = await this.repository.findByDateRange(from, to);
    return allShifts.map((shift: any) => shiftEntityToModel(shift));
  }
}

export function shiftEntityToModel(shift: any): Shift {
  return {
    id: +shift.id,
    date: shift.date,
    primary_staff: shift.primarystaff,
    secondary_staff: shift.secondarystaff,
    fulfilled: +shift.fulfilled,
    updatedAt: new Date(shift.updatedat),
    shop_open: +shift.shopopen,
  };
}
