import moment from 'moment';
import {Shift} from '../../shift/shift.interfaces';
import {StaffMember} from '../../staffMember/staffMember.interfaces';
import {NotificationHandler} from './NotificationHandlerFactory';
import {Publisher, NotificationViewModel, PublisherFactory} from '../Publishers';
import {formatEmail, TemplateName} from '../../../mailer/templator';
import {MinimalLogger} from '../../../twilioSMSClient/Interfaces';
import {IShiftService} from '../../shift/ShiftService';

export class DayOfUpdateHandler implements NotificationHandler {
  private readonly adminPublisher: Publisher;
  private readonly staffPublishers: Map<string, Publisher[]>;
  constructor(
    private readonly log: MinimalLogger,
    private readonly shiftService: IShiftService,
    publisherFactory: PublisherFactory,
    private readonly staff: StaffMember[],
  ) {
    this.staffPublishers = publisherFactory.manufactureStaffPublisherMap(staff, ['sms']);
    this.adminPublisher = publisherFactory.manufactureAdminPublisher();
  }

  async handle() {
    const todaysShift = await this.getTodaysShift();
    if (!todaysShift) {
      // no shifts for today, logged berlow in getTodaysShift()
      return;
    }
    await this.handleShift(todaysShift);
  }

  private async handleShift(shift: Shift): Promise<void | void[]> {
    // if shop is closed, no emails
    if (!shift.shop_open) {
      this.log.info({shift}, 'Not sending notifications for upcoming shift, shop closed');
      return Promise.resolve();
    }

    try {
      // if upcoming shift is empty and shop is open, draft email to staff
      if (!shift.primary_staff && !shift.secondary_staff) {
        return this.publsihUnstaffedShiftWarning(shift);
      }

      // if upcoming shift is staffed, draft emails to all assigned staffMembers
      const assignedStaffMembers = findAssignedStaffForShift(shift, this.staff);
      return this.publishShiftNotification(shift, assignedStaffMembers);
    } catch (err) {
      this.log.error({err}, 'could not send upcoming shift notificaiton');
      throw err;
    }
  }

  private async getTodaysShift(): Promise<Shift | undefined> {
    const now = moment();
    const startOfDay = now.startOf('day').toDate();
    const endOfDay = now.endOf('day').toDate();
    const [shift] = await this.shiftService.findByDateRange(startOfDay, endOfDay);

    if (!shift) {
      this.log.debug({date: now.toISOString()}, 'No shifts found for today');
    }
    return shift;
  }

  private async publsihUnstaffedShiftWarning(shift: Shift) {
    this.log.info({shift}, 'Sending empty shift warning notification');

    const vm: NotificationViewModel = {
      emailHtml: formatEmail(TemplateName.emptyShift, {shift}),
      subjectText: `⚠️ Unassigned Shift Today: ${formatDate(shift.date)}`,
      smsText: '', // admin publisher does not recieve sms
    };

    return await this.adminPublisher.publish(vm);
  }

  private async publishShiftNotification(shift: Shift, assignedStaffMembers: StaffMember[]) {
    this.log.info({shift, assignedStaffMembers}, 'Sending shift reminder notifications');

    const publishers = getPublishersForStaffMembers(assignedStaffMembers, this.staffPublishers);
    const vm: NotificationViewModel = {
      emailHtml: formatEmail(TemplateName.upcomingShift, {shift}),
      subjectText: `👋 SBK Reminder: Shift Today ${formatDate(shift.date)}`,
      smsText: `👋 SBK Reminder, you are on staff for SBK today: ${formatDate(shift.date)}
      Staff: ${assignedStaffMembers.map(s => capitalize(s.name)).join(', ')}`,
    };

    return await Promise.all(publishers.map(p => p.publish(vm)));
  }
}

function getPublishersForStaffMembers(assignedStaffMembers: StaffMember[], publishers: Map<string, Publisher[]>) {
  return assignedStaffMembers.reduce((pubs: Publisher[], staff) => {
    return pubs.concat(publishers.get(staff.id) || []);
  }, []);
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
