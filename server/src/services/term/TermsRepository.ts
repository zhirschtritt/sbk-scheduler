import {GoogleSheetsBaseRepository} from '../../repositories/GoogleSheetsBaseRepo';
import {TermEntity} from './term.interfaces';
import {GoogleSpreadSheetClient} from '../../interfaces';

export class TermsRepository extends GoogleSheetsBaseRepository<TermEntity> {
  constructor(spreadSheetClient: GoogleSpreadSheetClient) {
    super(spreadSheetClient, 'Terms');
  }
}
