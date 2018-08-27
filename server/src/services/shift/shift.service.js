// Initializes the `shift` service on path `/shifts`
const createService = require('./shift.class.js');
const hooks = require('./shift.hooks');

module.exports = function (app) {
  
  const termLength = app.get('termLength');
  const paginate = app.get('paginate');
  const sheets = app.get('sheetsClient');

  const options = {
    paginate,
    termLength,
    sheets
  };

  // Initialize our service with any options it requires
  const shifts = createService(options);

  shifts.docs = {
    find: {
      parameters: [
        {
          description: 'Number of results to return',
          in: 'query',
          name: '$limit',
          type: 'integer'
        },
        {
          description: 'Number of results to skip',
          in: 'query',
          name: '$skip',
          type: 'integer'
        },
        {
          description: 'Property to sort results',
          in: 'query',
          name: '$sort',
          type: 'string'
        },
        {
          description: 'Property to query results',
          in: 'query',
          name: '$search',
          type: 'string'
        }
      ]
    },
    definitions: {
      shift: require('./shift.schema')
    }
  };
  app.use('/shifts', shifts);

  // Get our initialized service so that we can register hooks
  const service = app.service('shifts');

  service.hooks(hooks);
};
