import {IsString, ValidateNested, IsEmail, IsDate, IsBoolean, IsPhoneNumber} from 'class-validator';

export interface MemberEntity {
  id: string;
  name: string;
  email: string;
  emailnotifications: string;
  smsnotifications: string;
  phonenumber: string;
  currenttermstart: string;
  currenttermend: string;
  membersince: string;
}

export class MemberTerm {
  @IsDate()
  start!: Date;

  @IsDate()
  end!: Date;
}

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

  @ValidateNested()
  term!: MemberTerm;
}
