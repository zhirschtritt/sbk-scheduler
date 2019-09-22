import {GoogleSheetsBaseRepository} from '../../repositories/GoogleSheetsBaseRepo';
import {MemberEntity} from './Memeber.model';
import {GoogleSpreadSheetClient} from '../../interfaces';

export class MemberRepository extends GoogleSheetsBaseRepository<MemberEntity> {
  constructor(spreadSheetClient: GoogleSpreadSheetClient) {
    super(spreadSheetClient, 'Members');
  }

  async findOneByName(name: string) {
    return await this.find(`name = ${name.toLowerCase()}`);
  }
}
