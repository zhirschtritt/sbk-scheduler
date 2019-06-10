import {BaseService} from '../interfaces';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  notifications: number;
  textNotifications: number;
}

export interface StaffMemberEntity {
  id: string;
  name: string;
  email: string;
  notifications: string;
  textnotifications: string;
  phonenumber: string;
}

export type IStaffMemberService = BaseService<StaffMember> & {
  findByName(name: string): Promise<StaffMember>;
};
