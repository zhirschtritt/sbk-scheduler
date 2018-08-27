// Initializes the `member` service on path `/members`
const createService = require('./member.class.js');
const hooks = require('./member.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');
  const sheets = app.get('sheetsClient');

  const options = {
    paginate,
    sheets
  };

  const members = createService(options);
  
  members.docs = {
    find: {
      parameters: [
        {
          description: 'Property to query results',
          in: 'query',
          name: '$search',
          type: 'string'
        }
      ]
    },
    definitions: {
      member: require('./member.schema')
    }
  };
  app.use('/members', members);

  // Get our initialized service so that we can register hooks
  const service = app.service('members');

  service.hooks(hooks);
};
