import {Application} from '@feathersjs/feathers';
import {MemberService} from './MemberService';
import {loggerFactory} from '../../logger';
import {Service} from '@feathersjs/feathers';
import {Member} from './Memeber.model';
import {customMethodWrapper} from '../customMethodWrapper';
import {GetRepository} from 'fireorm';

export default function(app: Application) {
  const repo = GetRepository(Member);
  const memberService = new MemberService(repo, loggerFactory);

  app.use('/members', memberService);

  const service: Service<Member> = app.service('members');
  applyCustomMethod(service, memberService.renew, 'renewMembership');
}

// TODO: export and use where needed
function applyCustomMethod(
  service: Service<Member>,
  concreteImpl: (...args: any) => any,
  methodName: string,
  trigger: 'create' = 'create',
) {
  service.hooks({
    before: {
      [trigger]: customMethodWrapper(service, methodName),
    },
  });
  // Not sure if reassigning this is necessary, probably can use same method name
  service[methodName] = concreteImpl;
}
