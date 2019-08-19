import {GoogleSheetsBaseRepository} from '../../repositories/GoogleSheetsBaseRepo';
import {MemberEntity, Member} from './Memeber.model';
import {GoogleSpreadSheetClient} from '../../interfaces';
import {GetRepository} from 'fireorm';

export class MemberRepository extends GoogleSheetsBaseRepository<MemberEntity> {
  constructor(spreadSheetClient: GoogleSpreadSheetClient) {
    super(spreadSheetClient, 'Members');
  }

  async findOneByName(name: string) {
    return await this.find(`name = ${name.toLowerCase()}`);
  }
}
