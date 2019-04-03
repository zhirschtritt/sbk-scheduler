import {NotificationContext} from '../notification.interfaces';

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
