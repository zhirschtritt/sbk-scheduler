const moment = require('moment');

/* eslint-disable no-unused-vars */
class Service {

  constructor ({mailer, members, shifts}) {
    this.mailer = mailer;
    this.members = members;
    this.shifts = shifts;
  }

  async create (data, params) { 
    // if a shift has been cleared by the client 
    if (data.message && data.message.type === 'cancelledShift') {
      const {shift, messageDetails} = data.message;

      return await this.mailer.sendEmail({
        template: {
          name: 'cancelledShift',
          context: {shift, messageDetails}
        },
        recipients: this.mailer.staffEmail,
        subject: `Cancelled Upcoming Shift ${shift.date}`
      });
    }

    // get next upcoming shift
    const today = moment().format('YYYY-MM-DD');
    const endOfWeek = moment().add(7, 'days').format('YYYY-MM-DD');
    const nextShifts = await this.shifts.find({query: {start: today, end: endOfWeek }});

    return Promise.all(
      nextShifts.map(async (shift) => {
        const isStaffAssigned = shift.primary_staff || shift.secondary_staff;

        // if no members assigned to upcoming shifts, draft email to staff
        if (!isStaffAssigned) { 
          return await this.mailer.sendEmail({
            template: {
              name: 'emptyShift',
              context: shift
            },
            recipients: this.mailer.staffEmail,
            subject: `⚠️ SBK Reminder: Unassigned Upcoming Shift ${shift.date}`
          });
        }

        // else draft emails to all assigned members per shift
        const allMembers = await this.members.find();

        const assignedMemberEmails = allMembers
          .filter((member) => {
            return [shift.primary_staff, shift.secondary_staff]
              .map((name) => name.toLowerCase())
              .includes(member.name.toLowerCase());
          })
          .filter((member) => !!member.notifications)
          .map((member) => member.email);
        
        return await this.mailer.sendEmail({
          template: {
            name: 'upcomingShift',
            context: shift,
          },
          recipients: assignedMemberEmails,
          subject: `👋 SBK Reminder: Upcoming Shift ${shift.date}`
        });
      })
    );
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
