import {
  Notification,
  WeeklyNotification,
  NotificationType,
  DayOfShiftNotification,
  CancelledShiftNotification,
  NotificationContext,
} from './notification.interfaces';

export function isNotification(maybeNotification: unknown): maybeNotification is Notification {
  return (
    isWeeklyNotification(maybeNotification) ||
    isCancelledShiftNotification(maybeNotification) ||
    isDayOfNotification(maybeNotification)
  );
}

export function isNotNullorUndefined(entity: unknown): entity is NonNullable<any> {
  return entity !== undefined && entity !== null;
}

export function isWeeklyNotification(maybeWeeklyNotification: unknown): maybeWeeklyNotification is WeeklyNotification {
  return (
    isNotNullorUndefined(maybeWeeklyNotification) &&
    (maybeWeeklyNotification as any).notificationType === NotificationType.weeklyShiftUpdate
  );
}

export function isDayOfNotification(maybeDayOfNotification: unknown): maybeDayOfNotification is DayOfShiftNotification {
  return (
    isNotNullorUndefined(maybeDayOfNotification) &&
    (maybeDayOfNotification as any).notificationType === NotificationType.dayOfShiftUpdate
  );
}

export function isCancelledShiftNotification(
  maybeCancelledShiftNotification: any,
): maybeCancelledShiftNotification is CancelledShiftNotification {
  return (
    isNotNullorUndefined(maybeCancelledShiftNotification) &&
    (maybeCancelledShiftNotification as any).notificationType === NotificationType.cancelledShift &&
    !!isNotificationContext(maybeCancelledShiftNotification.context)
  );
}

export function isNotificationContext(maybeNotificationCtx: any): maybeNotificationCtx is NotificationContext {
  return (
    isNotNullorUndefined(maybeNotificationCtx) &&
    maybeNotificationCtx &&
    !!maybeNotificationCtx.shift &&
    !!maybeNotificationCtx.staffMember &&
    !!maybeNotificationCtx.customMessage !== null &&
    !!maybeNotificationCtx.customMessage !== undefined
  );
}
