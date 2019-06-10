import {LoggerFactory, MinimalLogger} from '../../logger';
import {MemberRepository} from './MemberRepository';
import {Member, MemberEntity} from './member.interfaces';
import {BaseService} from '../interfaces';
import * as FeathersError from '@feathersjs/errors';
import moment = require('moment');

export type IMemberService = Pick<BaseService<Member>, 'find'>;

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

  private plainToClass(memberData: MemberEntity): Member {
    const member = new Member();
    member.name = memberData.name;
    member.id = memberData.id;
    member.email = memberData.email;
    member.emailNotifications = !!memberData.emailnotifications;
    member.smsNotifications = !!memberData.smsnotifications;
    member.phoneNumber = memberData.phonenumber;
    member.term = {
      start: moment(memberData.currenttermstart).toDate(),
      end: moment(memberData.currenttermend).toDate(),
    };
    return member;
  }
}
