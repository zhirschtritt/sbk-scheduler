/* eslint-disable no-unused-vars */
const moment = require('moment');

class Service {
  constructor ({sheets}) {
    this.sheets = sheets;
  }
  
  async getSheets () {
    const sheets = await this.sheets.getInfoAsync();
    let membersSheet = sheets.worksheets.filter((sheet) => sheet.title === 'Members');
    return {
      membersSheet: Promise.promisifyAll(membersSheet[0]),
      sheetId: membersSheet.id
    };
  }

  async find (params) {
    const { membersSheet } = await this.getSheets();

    const allMembers = await membersSheet.getRowsAsync();
    
    return allMembers
      .map((member) => {
        return {
          id: Number(member.id),
          name: member.name,
          email: member.email,
          notifications: Number(member.notifications),
        };
      });
  }

  async get (id, params) {
    const { membersSheet } = await this.getSheets();

    const [ member ] =  await membersSheet.getRowsAsync({
      query: `id = ${id}`
    });
    
    return {
      id: Number(member.id),
      name: member.name,
      email: member.email,
      notifications: Number(member.notifications),
    };

  }

  async patch (id, data, params) {
    const { membersSheet } = await this.getSheets();

    const [ member ] = await membersSheet.getRowsAsync({
      query: `id = ${id}`
    });

    const newMember = {
      notifications: data.notifications,
    };

    Object.assign(member, newMember);

    try { 
      member.save();
    } catch (err) {
      return new Error(err);
    }

    return {
      id: Number(member.id),
      name: member.name,
      email: member.email,
      notifications: Number(member.notifications),
    };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
