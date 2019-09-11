import {Shift} from '../shift/shift.interfaces';
import {StaffMember} from '../staffMember/staffMember.interfaces';

export enum NotificationType {
  cancelledShift = 'cancelledShift',
  weeklyShiftUpdate = 'weeklyShiftUpdate',
  dayOfShiftUpdate = 'dayOfShiftUpdate',
}

export interface NotificationContext {
  shift: Shift;
  staffMember?: StaffMember;
  customMessage?: string;
}

export interface WeeklyNotification {
  notificationType: NotificationType.weeklyShiftUpdate;
}

export interface DayOfShiftNotification {
  notificationType: NotificationType.dayOfShiftUpdate;
}

export interface CancelledShiftNotification {
  notificationType: NotificationType.cancelledShift;
  context: NotificationContext;
}

export type Notification = WeeklyNotification | CancelledShiftNotification | DayOfShiftNotification;
