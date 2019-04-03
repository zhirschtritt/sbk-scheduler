import moment from 'moment';
import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';
import {TwilioClient} from '../../../twilioSMSClient/TwilioClient';
import {Shift} from '../../shift/shift.interfaces';
import {StaffMember} from '../../staffMember/staffMember.interfaces';
import {NotificationHandler} from './NotificationHandlerFactory';
import {NotificationContext} from '../notification.interfaces';

export class WeeklyShiftUpdateHandler implements NotificationHandler {
  constructor(
    private readonly log: MinimalLogger,
    private readonly shiftService: any,
    private readonly staffMemberService: any,
    private readonly mailer: any,
    private readonly smsClient: TwilioClient,
  ) {}

  formatDate(date: string) {
    return moment(date).format('dddd, MMM D, YYYY');
  }

  sendEmptyShiftEmail(shift: Shift) {
    this.log.info('Sending empty shift warning email', JSON.stringify(shift, null, 2));
    return this.mailer.sendEmail({
      template: {
        name: 'emptyShift',
        context: shift,
      },
      recipients: this.mailer.staffEmail,
      subject: `⚠️ SBK Reminder: Unassigned Upcoming Shift ${this.formatDate(shift.date)}`,
    });
  }

  sendUpcomingShiftEmail(shift: Shift, assignedStaffMemberEmails: string[]) {
    this.log.info({shift, assignedStaffMemberEmails}, 'Sending shift reminder email');
    return this.mailer.sendEmail({
      template: {
        name: 'upcomingShift',
        context: shift,
      },
      recipients: assignedStaffMemberEmails,
      subject: `👋 SBK Reminder: Upcoming Shift ${this.formatDate(shift.date)}`,
    });
  }

  findAssignedStaffForShift(allStaffMembers: StaffMember[], upcomingShift: Shift): StaffMember[] {
    const assignedStaffMembers = allStaffMembers.filter(staffMember => {
      return [upcomingShift.primary_staff, upcomingShift.secondary_staff]
        .map(name => name.toLowerCase())
        .includes(staffMember.name.toLowerCase());
    });
    this.log.info({assignedStaffMembers}, 'Found assigned staff members for shifts');
    return assignedStaffMembers;
  }

  async handle(context: NotificationContext) {
    const today = moment().format('YYYY-MM-DD');
    const endOfWeek = moment()
      .add(7, 'days')
      .format('YYYY-MM-DD');
    const nextShifts: Shift[] = await this.shiftService.find({
      query: {start: today, end: endOfWeek},
    });
    const allStaffMembers = await this.staffMemberService.find();

    await Promise.all(
      nextShifts.map(async shift => {
        // if shop is closed, no emails
        if (!shift.shop_open) {
          return Promise.resolve('Not sending emails for upcoming shift, shop closed');
        }
        // if upcoming shifts are empty and shop is open, draft email to staff
        const isStaffAssigned = shift.primary_staff || shift.secondary_staff;
        if (!isStaffAssigned) {
          return await this.sendEmptyShiftEmail(shift);
        }

        // if upcoming shifts are staffed, draft emails to all assigned staffMembers
        const assignedStaffMembers = this.findAssignedStaffForShift(allStaffMembers, shift);

        const staffEmails = [];
        const staffPhoneNumbers = [];

        for (const staffMember of assignedStaffMembers) {
          if (staffMember.email && staffMember.notifications) {
            staffEmails.push(staffMember.email);
          }

          if (staffMember.phoneNumber && staffMember.textNotifications) {
            staffPhoneNumbers.push(staffMember.phoneNumber);
          }
        }

        return (
          await this.sendUpcomingShiftEmail(shift, filteredStaffEmails),
          // default, do not send email
          this.log.debug('Not sending emails for shift', {shift})
        );
        return Promise.resolve(`Not sending emails for shift: ${JSON.stringify(shift)}`);
      }),
    );
  }
}
