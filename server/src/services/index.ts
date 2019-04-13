import term from './term/term.service.js';
import staffMember from './staffMember/staffMember.service';
import shift from './shift/shift.service';
import notification from './notification/NotificationServiceFactory';
import {Application} from '@feathersjs/express';

export const services = (app: Application<any>) => {
  app.configure(term);
  app.configure(staffMember);
  app.configure(shift);
  app.configure(notification);
};
