import {assert} from 'chai';
import {isNotification, NotificationType} from '../../../src/services/notification';

describe.only('notification guards', function() {
  it('isNotifications', function() {
    assert.isTrue(isNotification({notificationType: NotificationType.dayOfShiftUpdate}));
    assert.isTrue(isNotification({notificationType: NotificationType.weeklyShiftUpdate}));
    assert.isFalse(isNotification({notificationType: 'unknown type'}));

    assert.isFalse(isNotification({notificationType: NotificationType.cancelledShift}));
  });
});
