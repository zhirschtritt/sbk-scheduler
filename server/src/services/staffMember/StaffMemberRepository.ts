import {GoogleSheetsBaseRepository} from '../../repositories/GoogleSheetsBaseRepo';
import {StaffMemberEntity} from './staffMember.interfaces';
import {GoogleSpreadSheetClient} from '../../interfaces';

export class StaffMemberRepository extends GoogleSheetsBaseRepository<StaffMemberEntity> {
  constructor(private readonly spreadSheetClient: GoogleSpreadSheetClient) {
    super(spreadSheetClient, 'Staff');
  }

  async findOneByName(name: string) {
    return await this.find(`name = ${name.toLowerCase()}`);
  }
}
