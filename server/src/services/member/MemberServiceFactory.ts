import {Application} from '@feathersjs/feathers';
import {MemberService} from './MemberService';
import {MemberRepository} from './MemberRepository';
import {loggerFactory} from '../../logger';
import {Service} from '@feathersjs/feathers';
import {Member} from './Memeber.model';
import {customMethodWrapper} from '../customMethodWrapper';

export default function(app: Application) {
  const sheets = app.get('sheetsClient');
  const repo = new MemberRepository(sheets);
  const memberService = new MemberService(repo, loggerFactory);

  app.use('/members', memberService);

  // TODO: create factory for this
  const service: Service<Member> = app.service('members');
  service.hooks({
    before: {
      create: customMethodWrapper(service, 'renewMembership'),
    },
  });
  service.renewMembership = memberService.renew;
}
