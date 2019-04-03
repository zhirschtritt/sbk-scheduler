// Initializes the `staffMember` service on path `/staffMembers`
const createService = require('./StaffMemberService.js');
const hooks = require('./staffMember.hooks');

module.exports = function(app) {
  const sheets = app.get('sheetsClient');

  const staffMembers = createService(sheets);

  staffMembers.docs = {
    find: {
      parameters: [
        {
          description: 'Property to query results',
          in: 'query',
          name: '$search',
          type: 'string',
        },
      ],
    },
    definitions: {
      staffMembers: require('./staffMember.schema'),
    },
  };

  app.use('/staffMembers', staffMembers);

  // Get our initialized service so that we can register hooks
  const service = app.service('staffMembers');

  service.hooks(hooks);
};
