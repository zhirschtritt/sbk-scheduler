import * as FeathersError from '@feathersjs/errors';
import moment from 'moment';
import {LoggerFactory, MinimalLogger} from '../../logger';
import {MemberRepository} from './MemberRepository';
import {Member, MemberEntity} from './Member.interfaces';
import {BaseService} from '../interfaces';
import {SheetRow} from '../../GoogleSheetsBaseRepo';

export type IMemberService = Pick<BaseService<Member>, 'find' | 'patch'>;

export class MemberService implements IMemberService {
  private readonly logger: MinimalLogger;

  constructor(private readonly repository: MemberRepository, loggerFactory: LoggerFactory) {
    this.logger = loggerFactory('MemberService');
  }

  async find() {
    try {
      const rawMembers = await this.repository.findAll();
      return rawMembers.map(raw => this.plainToClass(raw));
    } catch (err) {
      this.logger.error({err}, 'Error fetching member data');
      throw new FeathersError.GeneralError(err);
    }
  }

  async patch(id: string, patchData: Partial<Member>) {
    let member: SheetRow<MemberEntity>;
    try {
      member = await this.repository.findOneById(id);
    } catch (err) {
      throw new FeathersError.GeneralError(err);
    }

    const applyPatch = (field: keyof MemberEntity, maybeData: any) => {
      if (maybeData !== undefined) {
        let data = maybeData;
        if (typeof maybeData === 'boolean') {
          data = maybeData ? '1' : '0';
        }
        member[field] = data;
      }
    };

    const entityToPatch: [keyof MemberEntity, any][] = [
      ['emailnotifications', patchData.emailNotifications],
      ['smsnotifications', patchData.smsNotifications],
      ['currenttermstart', patchData.term && patchData.term.start && moment(patchData.term.start).format('YYYY-MM-DD')],
      ['currenttermend', patchData.term && patchData.term.end && moment(patchData.term.end).format('YYYY-MM-DD')],
    ];

    entityToPatch.filter(patch => patch[1] !== undefined).forEach(patch => applyPatch(patch[0], patch[1]));

    // TODO: validate patchedMemberData and throw on error(s)

    try {
      await member.save();
      const storedMember = this.plainToClass(member);

      this.logger.debug({storedMember, patchData}, 'Member saved');
      return storedMember;
    } catch (err) {
      this.logger.error({id, patchData, member: member}, 'Failure saving member');
      throw new FeathersError.Unprocessable('Failure saving member');
    }
  }

  private plainToClass(memberData: MemberEntity): Member {
    const member = new Member();
    member.name = memberData.name;
    member.id = memberData.id;
    member.email = memberData.email;
    member.emailNotifications = !!+memberData.emailnotifications;
    member.smsNotifications = !!+memberData.smsnotifications;
    member.phoneNumber = memberData.phonenumber;
    member.term = {
      start: new Date(memberData.currenttermstart),
      end: new Date(memberData.currenttermend),
    };
    return member;
  }
}
