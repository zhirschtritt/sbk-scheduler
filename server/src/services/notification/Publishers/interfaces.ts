import {NotificationContext} from '../notification.interfaces';
import {StaffMember} from '../../staffMember/staffMember.interfaces';

export enum TemplateName {
  upcomingShift = 'upcomingShift',
  emptyShift = 'emptyShift',
  cancelledShift = 'cancelledShift',
}

export interface Template {
  name: TemplateName;
  context: NotificationContext;
}

export interface Publisher {
  publish(viewModel: NotificationViewModel): Promise<void>;
}

export interface NotificationViewModel {
  emailHtml: string;
  subjectText: string;
  smsText: string;
}

enum PublisherTypes {
  sms = 'sms',
  email = 'email',
}

export type PublisherType = keyof typeof PublisherTypes;

export interface PublisherFactory {
  manufactureAdminPublisher(): Publisher;
  manufactureStaffPublisherMap(
    reciepients: StaffMember[],
    limitedPublishers?: PublisherType[],
  ): Map<string, Publisher[]>;
}
