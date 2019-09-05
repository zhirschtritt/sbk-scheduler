import * as FeathersError from '@feathersjs/errors';
import {BaseFirestoreRepository, IEntity} from 'fireorm';
import merge from 'deepmerge';
import moment from 'moment';
import {validate} from 'class-validator';
import {LoggerFactory, MinimalLogger} from '../../logger';
import {BaseService} from '../interfaces';
import {Member} from './Memeber.model';

export type IMemberService = Pick<BaseService<Member>, 'find' | 'patch' | 'get'> & {
  renew: (id: string, startDate: string) => Promise<Member>;
  create: (member: Member) => Promise<Member>;
};

export class MemberService implements IMemberService {
  private readonly logger: MinimalLogger;

  constructor(private readonly repository: BaseFirestoreRepository<Member>, loggerFactory: LoggerFactory) {
    this.logger = loggerFactory('MemberService');
  }

  async create(member: Member) {
    try {
      return await this.repository.create(member);
    } catch (err) {
      this.logger.error({member}, 'Error creating member');
      throw new FeathersError.GeneralError(err);
    }
  }

  async upsert(member: Member & IEntity) {
    try {
      const existingMember = await this.repository.findById(member && member.id);
      if (existingMember) {
        const patch = await this.applyPatch(existingMember, member);
        return await this.repository.update(patch);
      }
      return await this.repository.create(member);
    } catch (err) {
      this.logger.error({member}, 'Error creating member');
      throw new FeathersError.GeneralError(err);
    }
  }

  async get(id: string) {
    try {
      return await this.repository.findById(id);
    } catch (err) {
      this.logger.error({id}, 'Error retreiving member by id');
      throw new FeathersError.NotFound('Error retreiving member by id');
    }
  }

  async find() {
    try {
      return await this.repository.find();
    } catch (err) {
      this.logger.error({err}, 'Error fetching member data');
      throw new FeathersError.GeneralError(err);
    }
  }

  async renew(id: string, startDate: string) {
    const member = await this.repository.findById(id);

    const errors = this.isAbleToRenew(member, startDate);
    if (errors.length) {
      errors.forEach(err => {
        this.logger.error(err);
      });
      throw new FeathersError.Unprocessable('Unable to renew member', errors);
    }

    const newEnd = moment(startDate)
      .add(1, 'year')
      .toDate();

    member.term.end = newEnd;

    try {
      await this.repository.update(member);
      this.logger.debug({member, newEnd}, 'Updated yearly membership');
      return member;
    } catch (err) {
      this.logger.error({member, newEnd}, 'Error updating yearly membership');
      throw new FeathersError.GeneralError(err);
    }
  }

  private isAbleToRenew(member: Member, startDate: string): string[] {
    const errors: string[] = [];
    const currentTermEnd = moment.utc(member.term.end);
    const sixMonthsFromNow = moment.utc().add(6, 'months');
    const endLessThenSixMonths = currentTermEnd.isSameOrBefore(sixMonthsFromNow, 'days');

    if (!moment(startDate).isValid()) {
      errors.push(`Start date, ${startDate}, is not a valid date string`);
    }

    if (!endLessThenSixMonths) {
      errors.push('Cannot renew term, current term end is greater than 6 months from now');
    }

    return errors;
  }

  async patch(id: string, patchData: Partial<Member>) {
    const storedMember = await this.repository.findById(id);
    const updatedMember = await this.applyPatch(storedMember, patchData);

    try {
      await this.repository.update(updatedMember);
      this.logger.debug({member: id, patchData}, 'Member saved');
      return updatedMember;
    } catch (err) {
      this.logger.error({id, patchData, member: updatedMember}, 'Failure saving member');
      throw new FeathersError.Unprocessable('Failure saving member');
    }
  }

  private async applyPatch(storedMember: Member, patchData: Partial<Member>): Promise<Member> {
    const updatedMember = merge(storedMember, patchData);
    await this.validateMember(updatedMember);
    return updatedMember;
  }

  private async validateMember(member: Member): Promise<void> {
    const errs = await validate(member, {validationError: {target: false}});
    if (errs.length) {
      this.logger.error({errs}, 'Member data is not valid');
      throw new FeathersError.Unprocessable('Member data is not valid');
    }
  }
}
