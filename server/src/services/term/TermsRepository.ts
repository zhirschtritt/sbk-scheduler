import {GoogleSheetsBaseRepository} from '../../GoogleSheetsBaseRepo';
import {TermEntity} from './term.interfaces';
import {GoogleSpreadSheetClient} from '../../GoogleSheetsClientFactory';

export class TermsRepository extends GoogleSheetsBaseRepository<TermEntity> {
  constructor(spreadSheetClient: GoogleSpreadSheetClient) {
    super(spreadSheetClient, 'Terms');
  }
}
