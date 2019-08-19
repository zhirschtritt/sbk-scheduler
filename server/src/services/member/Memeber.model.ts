import {IsString, ValidateNested, IsEmail, IsDate, IsBoolean, IsPhoneNumber} from 'class-validator';
import {Collection} from 'fireorm';

export interface MemberEntity {
  id: string;
  name: string;
  email: string;
  emailnotifications: 1 | 0;
  smsnotifications: 1 | 0;
  phonenumber: string;
  currenttermend: string;
  membersince: string;
}

export class MemberTerm {
  @IsDate()
  end!: Date;
}

@Collection()
export class Member {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber('US')
  phoneNumber!: string;

  @IsBoolean()
  emailNotifications!: boolean;

  @IsBoolean()
  smsNotifications!: boolean;

  @IsDate()
  memberSince!: Date;

  @ValidateNested()
  term!: MemberTerm;

  @IsBoolean()
  isTermCurrent!: boolean;
}
