const moment = require('moment');

class WeeklyShiftUpdateHandler {
  constructor({log, shiftService, staffMemberService, mailer}) {
    this.log = log;
    this.shifts = shiftService;
    this.staffMembers = staffMemberService;
    this.mailer = mailer;
  }

  formatDate(date) {
    return moment(date).format('dddd, MMM D, YYYY');
  }

  sendEmptyShiftEmail(shift) {
    return this.mailer.sendEmail({
      template: {
        name: 'emptyShift',
        context: shift
      },
      recipients: this.mailer.staffEmail,
      subject: `⚠️ SBK Reminder: Unassigned Upcoming Shift ${this.formatDate(shift.date)}`
    });
  }

  sendUpcomingShiftEmail(shift, assignedStaffMemberEmails) {
    return this.mailer.sendEmail({
      template: {
        name: 'upcomingShift',
        context: shift,
      },
      recipients: assignedStaffMemberEmails,
      subject: `👋 SBK Reminder: Upcoming Shift ${this.formatDate(shift.date)}`
    });
  }

  filterStaffMemberEmails(allStaffMembers, upcomingShift) {
    return allStaffMembers
      .filter((staffMember) => {
        return [upcomingShift.primary_staff, upcomingShift.secondary_staff]
          .map((name) => name.toLowerCase())
          .includes(staffMember.name.toLowerCase());
      })
      .filter((staffMember) => !!staffMember.notifications)
      .map((staffMember) => staffMember.email);
  }

  async handle() {
    const today = moment().format('YYYY-MM-DD');
    const endOfWeek = moment().add(7, 'days').format('YYYY-MM-DD');
    const nextShifts = await this.shifts.find({query: {start: today, end: endOfWeek }});
    const allStaffMembers = await this.staffMembers.find();

    return Promise.all(
      nextShifts.map((shift) => {
        // if upcoming shifts are empty and shop is open, draft email to staff
        const isStaffAssigned = shift.primary_staff || shift.secondary_staff;
        if (!isStaffAssigned) { 
          if (shift.shop_open) {
            return this.sendEmptyShiftEmail(shift);
          }
          // don't send email for upcoming empty shift if shop is closed
          return Promise.resolve();
        }

        // else draft emails to all assigned staffMembers per shift
        const assignedStaffMemberEmails = this.filterStaffMemberEmails(allStaffMembers, shift);
        return this.sendUpcomingShiftEmail(shift, assignedStaffMemberEmails);
      })
    );
  }
}

module.exports = {
  WeeklyShiftUpdateHandler
};