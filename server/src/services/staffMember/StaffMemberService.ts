import {StaffMember} from './staffMember.interfaces';
import {Service} from '@feathersjs/feathers';

export type StaffMemberSerice = Pick<Service<StaffMember>, 'find' | 'get' | 'patch'> & {
  findByName(name: string): Promise<StaffMember>;
};

export class StaffMemberService implements StaffMemberSerice {
  constructor(private readonly sheets: any) {}

  private async getSheets() {
    const sheets = await this.sheets.getInfoAsync();
    const staffMemberSheet = sheets.worksheets.filter((sheet: any) => sheet.title === 'Staff');
    return {
      staffMemberSheet: (Promise as any).promisifyAll(staffMemberSheet[0]),
      sheetId: staffMemberSheet.id,
    };
  }

  async find() {
    const {staffMemberSheet} = await this.getSheets();
    const allStaffMembers = await staffMemberSheet.getRowsAsync();

    return allStaffMembers.map((staffMember: StaffMember) => staffMemberStoredToEntity(staffMember));
  }

  async get(id: string) {
    const {staffMemberSheet} = await this.getSheets();
    const [staffMember] = await staffMemberSheet.getRowsAsync({
      query: `id = ${id}`,
    });

    return staffMemberStoredToEntity(staffMember);
  }

  async findByName(name: string) {
    const {staffMemberSheet} = await this.getSheets();
    const [staffMember]: StaffMember[] = await staffMemberSheet.getRowsAsync({
      query: `name = ${name.toLowerCase()}`,
    });

    if (staffMember) {
      return staffMemberStoredToEntity(staffMember);
    } else {
      throw new Error(`Could not find matching staff member with name: ${name}`);
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
      throw new Error(err);
    }

    return staffMemberStoredToEntity(staffMember);
  }
}

export function isStaffMember(maybeStaffMember: unknown): maybeStaffMember is StaffMember {
  return (
    maybeStaffMember !== null &&
    maybeStaffMember !== undefined &&
    ['id', 'name', 'email', 'notifications', 'textNotifications', 'phoneNumber'].reduce((valid, field) => {
      return (maybeStaffMember as any)[field] !== null && (maybeStaffMember as any)[field] !== undefined;
    }, false)
  );
}

export function staffMemberStoredToEntity(storedStaffMember: unknown): StaffMember {
  if (!isStaffMember(storedStaffMember)) {
    throw new Error('Unknown staff member type');
  }
  return {
    id: +storedStaffMember.id,
    name: storedStaffMember.name,
    email: storedStaffMember.email,
    notifications: +storedStaffMember.notifications,
    textNotifications: +storedStaffMember.textNotifications,
    phoneNumber: storedStaffMember.phoneNumber,
  };
}

module.exports = function(options: any) {
  return new StaffMemberService(options);
};
