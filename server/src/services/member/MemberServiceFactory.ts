import {Application} from '@feathersjs/feathers';
import {MemberService} from './MemberService';
import {MemberRepository} from './MemberRepository';
import {loggerFactory} from '../../logger';

export default function(app: Application) {
  const sheets = app.get('sheetsClient');
  const repo = new MemberRepository(sheets);
  const memberService = new MemberService(repo, loggerFactory);

  app.use('/members', memberService);
}
