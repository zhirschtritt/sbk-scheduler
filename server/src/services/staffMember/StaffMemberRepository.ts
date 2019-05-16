import {GoogleSheetsBaseRepository} from '../../GoogleSheetsBaseRepo';
import {GoogleSpreadSheetClient} from '../../GoogleSheetsClientFactory';
import {StaffMemberEntity} from './staffMember.interfaces';

export class StaffMemberRepository extends GoogleSheetsBaseRepository<StaffMemberEntity> {
  constructor(private readonly spreadSheetClient: GoogleSpreadSheetClient) {
    super(spreadSheetClient, 'Staff');
  }

  async findOneByName(name: string) {
    return await this.find(`name = ${name.toLowerCase()}`);
  }
}
