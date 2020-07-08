import {GoogleSheetsBaseRepository} from '../../repositories/GoogleSheetsBaseRepo';
import {ShiftEntity} from './shift.interfaces';
import moment from 'moment';
import {GoogleSpreadSheetClient} from '../../interfaces';

export class ShiftRepository extends GoogleSheetsBaseRepository<ShiftEntity> {
  constructor(spreadSheetClient: GoogleSpreadSheetClient) {
    super(spreadSheetClient, 'Shifts');
  }

  async findByDateRange(from: Date, to: Date) {
    return await this.find(`date >= ${formatDateForQuery(from)} && date <= ${formatDateForQuery(to)}`);
  }
}

function formatDateForQuery(date: Date): string {
  return moment(date).format('YYYY-MM-DD');
}
