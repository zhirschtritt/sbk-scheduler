// Initializes the `member` service on path `/members`
const createService = require('./member.class.js');
const hooks = require('./member.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
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
  app.use('/api/members', members);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/members');

  service.hooks(hooks);
};
