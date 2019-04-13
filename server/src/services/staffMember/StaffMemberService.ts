import {
  StaffMember,
  StaffMemberEntity,
  IStaffMemberService,
} from './staffMember.interfaces';
import logger from '../../logger';
export class StaffMemberService implements IStaffMemberService {
  constructor(private readonly sheets: any) {}

  private async getSheets() {
    const sheets = await this.sheets.getInfoAsync();
    const staffMemberSheet = sheets.worksheets.filter(
      (sheet: any) => sheet.title === 'Staff',
    );
    return {
      staffMemberSheet: (Promise as any).promisifyAll(staffMemberSheet[0]),
      sheetId: staffMemberSheet.id,
    };
  }

  async find() {
    const {staffMemberSheet} = await this.getSheets();
    const allStaffMembers = await staffMemberSheet.getRowsAsync();

    return allStaffMembers.map((staffMember: StaffMember) =>
      staffMemberEntityToModel(staffMember),
    );
  }

  async get(id: string) {
    const {staffMemberSheet} = await this.getSheets();
    const [staffMember] = await staffMemberSheet.getRowsAsync({
      query: `id = ${id}`,
    });

    return staffMemberEntityToModel(staffMember);
  }

  async findByName(name: string) {
    const {staffMemberSheet} = await this.getSheets();
    const [staffMember]: StaffMember[] = await staffMemberSheet.getRowsAsync({
      query: `name = ${name.toLowerCase()}`,
    });

    if (staffMember) {
      return staffMemberEntityToModel(staffMember);
    } else {
      throw new Error(
        `Could not find matching staff member with name: ${name}`,
      );
    }
  }

  async patch(id: string, data: Partial<StaffMember>) {
    const {staffMemberSheet} = await this.getSheets();
    const [staffMember] = await staffMemberSheet.getRowsAsync({
      query: `id = ${id}`,
    });

    const newStaffer = {
      notifications: data.notifications,
    };

    Object.assign(staffMember, newStaffer);

    try {
      await staffMember.save();
    } catch (err) {
      logger.error('error updating staffMember');
      throw new Error(err);
    }

    return staffMemberEntityToModel(staffMember);
  }
}

export function isStaffMemberEntity(
  maybeStaffMember: unknown,
): maybeStaffMember is StaffMemberEntity {
  return (
    maybeStaffMember !== null &&
    maybeStaffMember !== undefined &&
    [
      'id',
      'name',
      'email',
      'notifications',
      'textnotifications',
      'phonenumber',
    ].every(field => {
      return (
        (maybeStaffMember as any)[field] !== null &&
        (maybeStaffMember as any)[field] !== undefined
      );
    })
  );
}

export function staffMemberEntityToModel(
  staffMemberEntity: unknown,
): StaffMember {
  if (!isStaffMemberEntity(staffMemberEntity)) {
    logger.error('Unknown staff member type', {staffMemberEntity});
    throw new Error('Unknown staff member type');
  }
  return {
    id: +staffMemberEntity.id,
    name: staffMemberEntity.name,
    email: staffMemberEntity.email,
    notifications: +staffMemberEntity.notifications,
    textNotifications: +staffMemberEntity.textnotifications,
    phoneNumber: `+1${staffMemberEntity.phonenumber}`,
  };
}

export default function(options: any) {
  return new StaffMemberService(options);
}
