import * as FeathersError from '@feathersjs/errors';
import * as _ from 'lodash';
import moment from 'moment';
import {validate} from 'class-validator';
import {LoggerFactory, MinimalLogger} from '../../logger';
import {MemberRepository} from './MemberRepository';
import {BaseService} from '../interfaces';
import {SheetRow} from '../../GoogleSheetsBaseRepo';
import {Member, MemberEntity} from './interfaces';

export type IMemberService = Pick<BaseService<Member>, 'find' | 'patch' | 'get'>;

export class MemberService implements IMemberService {
  private readonly logger: MinimalLogger;

  constructor(private readonly repository: MemberRepository, loggerFactory: LoggerFactory) {
    this.logger = loggerFactory('MemberService');
  }

  async get(id: string) {
    try {
      const rawMember = await this.repository.findOneById(id);
      return this.entityToClass(rawMember);
    } catch (err) {
      this.logger.error({id}, 'Error retreiving member by id');
      throw new FeathersError.Unprocessable('Error retreiving member by id');
    }
  }

  async find() {
    try {
      const rawMembers = await this.repository.findAll();
      return rawMembers.map(raw => this.entityToClass(raw));
    } catch (err) {
      this.logger.error({err}, 'Error fetching member data');
      throw new FeathersError.GeneralError(err);
    }
  }

  async patch(id: string, patchData: Partial<Member>) {
    let storedMember: SheetRow<MemberEntity>;
    try {
      storedMember = await this.repository.findOneById(id);
    } catch (err) {
      throw new FeathersError.GeneralError(err);
    }

    const updatedMember = _.merge(this.entityToClass(storedMember), patchData);

    await this.logValidateMember(updatedMember);

    Object.assign(storedMember, this.classToEntity(updatedMember));

    try {
      await storedMember.save();

      this.logger.debug({updatedMember, patchData}, 'Member saved');
      return updatedMember;
    } catch (err) {
      this.logger.error({id, patchData, member: storedMember}, 'Failure saving member');
      throw new FeathersError.Unprocessable('Failure saving member');
    }
  }

  private entityToClass(memberData: MemberEntity): Member {
    const member = new Member();
    member.name = memberData.name;
    member.id = memberData.id;
    member.email = memberData.email;
    member.emailNotifications = !!+memberData.emailnotifications;
    member.smsNotifications = !!+memberData.smsnotifications;
    member.phoneNumber = memberData.phonenumber;
    member.memberSince = new Date(memberData.membersince);
    member.term = {
      start: new Date(memberData.currenttermstart),
      end: new Date(memberData.currenttermend),
    };
    return member;
  }

  private classToEntity(member: Member): MemberEntity {
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      emailnotifications: member.emailNotifications ? 1 : 0,
      smsnotifications: member.smsNotifications ? 1 : 0,
      phonenumber: member.phoneNumber,
      membersince: moment(member.memberSince).format('YYYY-MM-DD'),
      currenttermstart: moment(member.term.start).format('YYYY-MM-DD'),
      currenttermend: moment(member.term.end).format('YYYY-MM-DD'),
    };
  }

  private async logValidateMember(member: Member): Promise<void> {
    const errs = await validate(member, {validationError: {target: false}});
    if (errs.length) {
      this.logger.error({errs}, 'Member data is not valid');
      throw new FeathersError.Unprocessable('Member data is not valid');
    }
  }
}
