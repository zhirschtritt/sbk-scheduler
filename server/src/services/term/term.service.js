// Initializes the `term` service on path `/terms`
const createService = require('./term.class.js');
const hooks = require('./term.hooks');

module.exports = function (app) {
  const termLength = app.get('termLength');
  const paginate = app.get('paginate');

  const sheets = app.get('sheetsClient');

  const options = {
    paginate,
    sheets,
    termLength
  };

  // Initialize our service with any options it requires
  // app.use('/terms', createService(options)); 
  const terms = createService(options);
  terms.docs = {
  //overwrite things here.
  //if we want to add a mongoose style $search hook to find, we can write this:
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
      term: require('./term.schema')
    }
  };
  app.use('/api/terms', terms);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/terms');

  service.hooks(hooks);
};
