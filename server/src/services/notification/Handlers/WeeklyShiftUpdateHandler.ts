import moment from 'moment';
import {Shift} from '../../shift/shift.interfaces';
import {StaffMember} from '../../staffMember/staffMember.interfaces';
import {NotificationHandler} from './NotificationHandlerFactory';
import {NotificationContext} from '../notification.interfaces';
import {Publisher, NotificationViewModel} from '../Publishers';
import {formatEmail, TemplateName} from '../../../mailer/templator';
import {getAdminPublisher} from '../Publishers';
import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';
import {IShiftService} from '../../shift/ShiftService';

export class WeeklyShiftUpdateHandler implements NotificationHandler {
  private readonly adminPublisher: Publisher;
  constructor(
    private readonly log: MinimalLogger,
    private readonly shiftService: IShiftService,
    private readonly publishers: Map<string, Publisher[]>,
    private readonly staff: StaffMember[],
  ) {
    this.adminPublisher = getAdminPublisher(this.publishers);
  }

  private async sendEmptyShiftEmail(shift: Shift) {
    this.log.info({shift}, 'Sending empty shift warning notification');

    const vm: NotificationViewModel = {
      emailHtml: formatEmail(TemplateName.emptyShift, {shift}),
      subjectText: `⚠️ SBK Reminder: Unassigned Upcoming Shift ${formatDate(shift.date)}`,
      smsText: '',
    };

    return await this.adminPublisher.publish(vm);
  }

  private async sendUpcomingShiftEmail(shift: Shift, assignedStaffMembers: StaffMember[]) {
    this.log.info({shift, assignedStaffMembers}, 'Sending shift reminder notifications');

    const publishers = getPublishersForStaffMembers(assignedStaffMembers, this.publishers);
    const vm: NotificationViewModel = {
      emailHtml: formatEmail(TemplateName.upcomingShift, {shift}),
      subjectText: `👋 SBK Reminder: Upcoming Shift ${formatDate(shift.date)}`,
      smsText: `👋 SBK Reminder, you have an upcoming SBK shift this week: ${formatDate(shift.date)}
      Staff: ${assignedStaffMembers.map(s => capitalize(s.name)).join(', ')}`,
    };

    return await Promise.all(publishers.map(p => p.publish(vm)));
  }

  private async handleNextShift(shift: Shift): Promise<void | void[]> {
    // if shop is closed, no emails
    if (!shift.shop_open) {
      this.log.info({shift}, 'Not sending notifications for upcoming shift, shop closed');
      return Promise.resolve();
    }

    try {
      // if upcoming shift is empty and shop is open, draft email to staff
      const isStaffAssigned = shift.primary_staff || shift.secondary_staff;
      if (!isStaffAssigned) {
        return this.sendEmptyShiftEmail(shift);
      }

      // if upcoming shift is staffed, draft emails to all assigned staffMembers
      const assignedStaffMembers = findAssignedStaffForShift(shift, this.staff);
      return this.sendUpcomingShiftEmail(shift, assignedStaffMembers);
    } catch (err) {
      this.log.error({err}, 'could not send upcoming shift notificaiton');
      throw err;
    }
  }

  async handle(context: NotificationContext) {
    const nextShifts = await getShiftsForWeek(this.shiftService);
    await Promise.all(nextShifts.map(shift => this.handleNextShift(shift)));
  }
}

function getPublishersForStaffMembers(assignedStaffMembers: StaffMember[], publishers: Map<string, Publisher[]>) {
  return assignedStaffMembers.reduce((pubs: Publisher[], staff) => {
    return pubs.concat(publishers.get(staff.id) || []);
  }, []);
}

async function getShiftsForWeek(shiftService: IShiftService): Promise<Shift[]> {
  const today = new Date();
  const endOfWeek = moment()
    .add(7, 'days')
    .toDate();
  return await shiftService.findByDateRange(today, endOfWeek);
}

function findAssignedStaffForShift(upcomingShift: Shift, staff: StaffMember[]): StaffMember[] {
  const assignedStaffMembers = staff.filter(staffMember => {
    return [upcomingShift.primary_staff, upcomingShift.secondary_staff]
      .map(name => name.toLowerCase())
      .includes(staffMember.name.toLowerCase());
  });
  return assignedStaffMembers;
}

function formatDate(date: string | Date) {
  return moment(date).format('dddd, MMM D, YYYY');
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
