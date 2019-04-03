import {Shift} from '../shift/shift.interfaces';
import {StaffMember} from '../staffMember/staffMember.interfaces';
import {NotificationContext} from 'twilio/lib/rest/api/v2010/account/notification';

export enum NotificationType {
  cancelledShift = 'cancelledShift',
  weeklyShiftUpdate = 'weeklyShiftUpdate',
}

export interface NotificationContext {
  shift: Shift;
  staffMember: StaffMember;
  customMessage?: string;
}

export interface WeeklyNotification {
  notificationType: NotificationType.weeklyShiftUpdate;
}

export interface CancelledShiftNotification {
  notificationType: NotificationType.cancelledShift;
  context: NotificationContext;
}

export type Notification = WeeklyNotification | CancelledShiftNotification;

export function isNotification(maybeNotification: unknown): maybeNotification is Notification {
  return (
    maybeNotification !== undefined &&
    maybeNotification !== null &&
    (!!isWeeklyNotification(maybeNotification) || !!isCancelledShiftNotification(maybeNotification))
  );
}

export function isWeeklyNotification(maybeWeeklyNotification: unknown): maybeWeeklyNotification is Notification {
  return (
    maybeWeeklyNotification !== undefined &&
    maybeWeeklyNotification !== null &&
    (maybeWeeklyNotification as any).notificationType === 'weeklyShiftUpdate'
  );
}

export function isCancelledShiftNotification(
  maybeCancelledShiftNotification: unknown,
): maybeCancelledShiftNotification is Notification {
  return (
    maybeCancelledShiftNotification !== undefined &&
    maybeCancelledShiftNotification !== null &&
    (maybeCancelledShiftNotification as any).notificationType === 'cancelledShift' &&
    !!isNotificationContext((maybeCancelledShiftNotification as any).context)
  );
}

export function isNotificationContext(maybeNotificationCtx: unknown): maybeNotificationCtx is NotificationContext {
  return (
    maybeNotificationCtx &&
    !!(maybeNotificationCtx as any).shift &&
    !!(maybeNotificationCtx as any).staffMember &&
    !!(maybeNotificationCtx as any).customMessage !== null &&
    !!(maybeNotificationCtx as any).customMessage !== undefined
  );
}
