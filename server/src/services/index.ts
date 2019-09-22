import term from './term/term.service';
import staffMember from './staffMember/staffMember.service';
import shift from './shift/shift.service';
import notification from './notification/NotificationServiceFactory';
import member from './member/MemberServiceFactory';
import {Application} from '@feathersjs/feathers';

export const services = (app: Application) => {
  app.configure(term);
  app.configure(staffMember);
  app.configure(shift);
  app.configure(notification);
  app.configure(member);
};
