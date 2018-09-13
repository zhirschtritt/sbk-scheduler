const moment = require('moment');

/* eslint-disable no-unused-vars */
class Service {

  constructor ({mailer, members, shifts}) {
    this.mailer = mailer;
    this.members = members;
    this.shifts = shifts;
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) { 
    const today = moment().format('YYYY-MM-DD');
    const endOfWeek = moment().add(7, 'days').format('YYYY-MM-DD');
    
    // get next upcoming shift
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
            subject: 'SBK Reminder: Unassigned Upcoming Shifts'
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
          .map((member) => member.email);
        
        return await this.mailer.sendEmail({
          template: {
            name: 'upcomingShift',
            context: shift,
          },
          recipients: assignedMemberEmails,
          subject: 'SBK Reminder: Upcoming Shift'
        });
      })
    );
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
