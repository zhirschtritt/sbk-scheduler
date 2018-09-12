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
        };
      });
  }

  async get (id, params) {
    const { membersSheet } = await this.getSheets();

    const member =  await membersSheet.getRowsAsync({
      query: `id = ${id}`
    });
    
    return {
      id: Number(member[0].id),
      name: member[0].name,
      email: member.email,
    };

  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
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
