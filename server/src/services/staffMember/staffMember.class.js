/* eslint-disable no-unused-vars */
const moment = require('moment');

class Service {
  constructor ({sheets}) {
    this.sheets = sheets;
  }
  
  async getSheets () {
    const sheets = await this.sheets.getInfoAsync();
    let staffMemberSheet = sheets.worksheets.filter((sheet) => sheet.title === 'Staff');
    return {
      staffMemberSheet: Promise.promisifyAll(staffMemberSheet[0]),
      sheetId: staffMemberSheet.id
    };
  }

  async find (params) {
    const { staffMemberSheet } = await this.getSheets();

    const allStaffer = await staffMemberSheet.getRowsAsync();
    
    return allStaffer
      .map((staffMember) => {
        return {
          id: Number(staffMember.id),
          name: staffMember.name,
          email: staffMember.email,
          notifications: Number(staffMember.notifications),
        };
      });
  }

  async get (id, params) {
    const { staffMemberSheet } = await this.getSheets();

    const [ staffMember ] =  await staffMemberSheet.getRowsAsync({
      query: `id = ${id}`
    });
    
    return {
      id: Number(staffMember.id),
      name: staffMember.name,
      email: staffMember.email,
      notifications: Number(staffMember.notifications),
    };

  }

  async patch (id, data, params) {
    const { staffMemberSheet } = await this.getSheets();

    const [ staffMember ] = await staffMemberSheet.getRowsAsync({
      query: `id = ${id}`
    });

    const newStaffer = {
      notifications: data.notifications,
    };

    Object.assign(staffMember, newStaffer);

    try { 
      staffMember.save();
    } catch (err) {
      return new Error(err);
    }

    return {
      id: Number(staffMember.id),
      name: staffMember.name,
      email: staffMember.email,
      notifications: Number(staffMember.notifications),
    };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
