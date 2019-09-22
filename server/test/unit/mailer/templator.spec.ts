import 'mocha';
import {assert} from 'chai';
import {parse} from 'node-html-parser';

import {formatEmail} from '../../../src/mailer/templator';
import {Shift} from '../../../src/services/shift/shift.interfaces';
import {StaffMember} from '../../../src/services/staffMember/staffMember.interfaces';

describe(formatEmail.name, function() {
  let staffMember: StaffMember;
  let shift: Shift;

  beforeEach(function() {
    staffMember = {
      id: 'someMemberId',
      email: 'some@email.com',
      name: 'primaryStaffer',
      notifications: 1,
      phoneNumber: '23423423423',
      textNotifications: 1,
    };
    shift = {
      id: 'someId',
      date: new Date(),
      fulfilled: 1,
      primary_staff: staffMember.name,
      secondary_staff: 'second_person',
      shop_open: 1,
      updatedAt: new Date(),
    };
  });

  context('upcoming shift', function() {
    it('has secondary member', function() {
      const email = formatEmail('upcomingShift', {staffMember, shift});

      assert.isOk(email);
      const parsed = parse(email);
      console.log(parsed.text);
      assert.isTrue(parsed.valid);
    });
    it('has *no* secondary member', function() {
      shift.secondary_staff = undefined;
      const email = formatEmail('upcomingShift', {staffMember, shift});

      assert.isOk(email);
      const parsed = parse(email);
      assert.isTrue(parsed.valid);
      console.log(parsed.text);
    });
  });
});
