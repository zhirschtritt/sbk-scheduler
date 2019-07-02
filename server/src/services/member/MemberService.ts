import * as FeathersError from '@feathersjs/errors';
import merge from 'deepmerge';
import moment from 'moment';
import {validate} from 'class-validator';
import {LoggerFactory, MinimalLogger} from '../../logger';
import {MemberRepository} from './MemberRepository';
import {BaseService} from '../interfaces';
import {SheetRow} from '../../GoogleSheetsBaseRepo';
import {Member, MemberEntity} from './Memeber.model';

export type IMemberService = Pick<BaseService<Member>, 'find' | 'patch' | 'get'> & {
  renew: (id: string) => Promise<Member>;
};

export class MemberService implements IMemberService {
  private readonly logger: MinimalLogger;

  constructor(private readonly repository: MemberRepository, loggerFactory: LoggerFactory) {
    this.logger = loggerFactory('MemberService');
  }

  async create(data: any) {
    this.logger.error('Create not implemented');
    return;
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

  async renew(id: string) {
    const storedMember = await this.repository.findOneById(id);
    const member = this.entityToClass(storedMember);

    const errors = this.isAbleToRenew(member);
    if (errors.length) {
      errors.forEach(err => {
        this.logger.error(err);
      });
      throw new FeathersError.Unprocessable('Unable to renew member', errors);
    }

    // if the members current term end is in the future,
    // set the new start date to current term end, else new start is today
    const newStart = member.term.end >= new Date() ? member.term.end : new Date();
    const newEnd = moment(newStart)
      .add(1, 'year')
      .toDate();

    member.term.end = newEnd;

    const updatedMemberEntity = await this.applyPatch(storedMember, member);

    try {
      await updatedMemberEntity.save();
      this.logger.debug({member, newEnd}, 'Updated yearly membership');
      return member;
    } catch (err) {
      this.logger.error({member, newEnd}, 'Error updating yearly membership');
      throw new FeathersError.GeneralError(err);
    }
  }

  private isAbleToRenew(member: Member): string[] {
    const errors: string[] = [];
    const currentTermEnd = moment.utc(member.term.end);
    const sixMonthsFromNow = moment.utc().add(6, 'months');
    const endLessThenSixMonths = currentTermEnd.isSameOrBefore(sixMonthsFromNow, 'days');

    if (!endLessThenSixMonths) {
      errors.push('Cannot renew term, current term end is greater than 6 months from now');
    }
    return errors;
  }

  async patch(id: string, patchData: Partial<Member>) {
    const storedMember = await this.repository.findOneById(id);
    const updatedMemberEntity = await this.applyPatch(storedMember, patchData);
    const updatedMember = this.entityToClass(updatedMemberEntity);

    try {
      await updatedMemberEntity.save();

      this.logger.debug({member: id, patchData}, 'Member saved');
      return updatedMember;
    } catch (err) {
      this.logger.error({id, patchData, member: updatedMember}, 'Failure saving member');
      throw new FeathersError.Unprocessable('Failure saving member');
    }
  }

  private async applyPatch(
    storedMember: SheetRow<MemberEntity>,
    patchData: Partial<Member>,
  ): Promise<SheetRow<MemberEntity>> {
    const updatedMember = merge(this.entityToClass(storedMember), patchData);
    await this.logValidateMember(updatedMember);
    return Object.assign(storedMember, this.classToEntity(updatedMember));
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
