const moment = require('moment');

/* eslint-disable no-unused-vars */
class Service {

  constructor ({mailer, staffMembers, shifts}) {
    this.mailer = mailer;
    this.staffMembers = staffMembers;
    this.shifts = shifts;
  }

  formatDate(date) {
    return moment(date).format('dddd, MMM D, YYYY');
  }

  async create (data, params) { 
    // notification = {
    //   notificationType: String,
    //   message: String,
    //   context: {
    //     shift: Shift,
    //     staffMember: StaffMember,
    //   }
    // }

    // if a shift has been cleared by the client 
    if (data && data.notificationType === 'cancelledShift') {
      const { shift, staffMember } = data.context;
      const { message } = data;

      return await this.mailer.sendEmail({
        template: {
          name: 'cancelledShift',
          context: {shift, staffMember, message}
        },
        recipients: this.mailer.staffEmail,
        subject: `⚠️ Cancelled Upcoming Shift: ${this.formatDate(shift.date)}`
      });
    }

    // get next upcoming shift`
    const today = moment().format('YYYY-MM-DD');
    const endOfWeek = moment().add(7, 'days').format('YYYY-MM-DD');
    const nextShifts = await this.shifts.find({query: {start: today, end: endOfWeek }});

    return Promise.all(
      nextShifts.map(async (shift) => {
        const isStaffAssigned = shift.primary_staff || shift.secondary_staff;

        // if no staffMembers assigned to upcoming shifts, draft email to staff
        if (!isStaffAssigned) { 
          return await this.mailer.sendEmail({
            template: {
              name: 'emptyShift',
              context: shift
            },
            recipients: this.mailer.staffEmail,
            subject: `⚠️ SBK Reminder: Unassigned Upcoming Shift ${this.formatDate(shift.date)}`
          });
        }

        // else draft emails to all assigned staffMembers per shift
        const allStaffMembers = await this.staffMembers.find();

        const assignedStaffMemberEmails = allStaffMembers
          .filter((staffMember) => {
            return [shift.primary_staff, shift.secondary_staff]
              .map((name) => name.toLowerCase())
              .includes(staffMember.name.toLowerCase());
          })
          .filter((staffMember) => !!staffMember.notifications)
          .map((staffMember) => staffMember.email);
        
        return await this.mailer.sendEmail({
          template: {
            name: 'upcomingShift',
            context: shift,
          },
          recipients: assignedStaffMemberEmails,
          subject: `👋 SBK Reminder: Upcoming Shift ${this.formatDate(shift.date)}`
        });
      })
    );
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
