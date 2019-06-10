import {GoogleSheetsBaseRepository} from '../../GoogleSheetsBaseRepo';
import {GoogleSpreadSheetClient} from '../../GoogleSheetsClientFactory';
import {MemberEntity} from './member.interfaces';

export class MemberRepository extends GoogleSheetsBaseRepository<MemberEntity> {
  constructor(spreadSheetClient: GoogleSpreadSheetClient) {
    super(spreadSheetClient, 'Members');
  }

  async findOneByName(name: string) {
    return await this.find(`name = ${name.toLowerCase()}`);
  }
}
