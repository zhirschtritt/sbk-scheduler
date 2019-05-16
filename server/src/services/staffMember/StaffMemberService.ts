import {StaffMember, StaffMemberEntity, IStaffMemberService} from './staffMember.interfaces';
import {logger} from '../../logger';
import {StaffMemberRepository} from './StaffMemberRepository';
export class StaffMemberService implements IStaffMemberService {
  constructor(private readonly repository: StaffMemberRepository) {}

  async find() {
    const allStaffMembers = await this.repository.findAll();

    return allStaffMembers.map((staffMember: StaffMemberEntity) => staffMemberEntityToModel(staffMember));
  }

  async get(id: string) {
    const staffMember = await this.repository.findOneById(id);

    return staffMemberEntityToModel(staffMember);
  }

  async findByName(name: string) {
    const staffMember = await this.repository.findOneByName(name);

    if (staffMember) {
      return staffMemberEntityToModel(staffMember);
    } else {
      throw new Error(`Could not find matching staff member with name: ${name}`);
    }
  }

  async patch(id: string, data: Partial<StaffMember>) {
    const staffMember = await this.repository.findOneById(id);

    // TODO: use entity <-> model mapping here
    const newStaffer: Pick<StaffMemberEntity, 'notifications' | 'textnotifications'> = {
      notifications: `${data.notifications}` || '0',
      textnotifications: `${data.textNotifications}` || '0',
    };

    Object.assign(staffMember, newStaffer);

    try {
      await staffMember.save();
    } catch (err) {
      logger.error('error updating staffMember');
      throw err;
    }

    return staffMemberEntityToModel(staffMember);
  }
}

export function isStaffMemberEntity(maybeStaffMember: unknown): maybeStaffMember is StaffMemberEntity {
  return (
    maybeStaffMember !== null &&
    maybeStaffMember !== undefined &&
    ['id', 'name', 'email', 'notifications', 'textnotifications', 'phonenumber'].every(field => {
      return (maybeStaffMember as any)[field] !== null && (maybeStaffMember as any)[field] !== undefined;
    })
  );
}

export function staffMemberEntityToModel(staffMemberEntity: unknown): StaffMember {
  if (!isStaffMemberEntity(staffMemberEntity)) {
    logger.error({staffMemberEntity}, 'Unknown staff member type');
    throw new Error('Unknown staff member type');
  }
  return {
    id: +staffMemberEntity.id,
    name: staffMemberEntity.name,
    email: staffMemberEntity.email,
    notifications: +staffMemberEntity.notifications,
    textNotifications: +staffMemberEntity.textnotifications,
    phoneNumber: staffMemberEntity.phonenumber,
  };
}

export default function(repository: StaffMemberRepository) {
  return new StaffMemberService(repository);
}
