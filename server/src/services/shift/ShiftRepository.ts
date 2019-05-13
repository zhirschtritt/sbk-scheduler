import {GoogleSheetsBaseRepository} from '../../GoogleSheetsBaseRepo';
import {GoogleSpreadSheetClient} from '../../GoogleSheetsClientFactory';
import {ShiftEntity} from './shift.interfaces';
import moment = require('moment');

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
