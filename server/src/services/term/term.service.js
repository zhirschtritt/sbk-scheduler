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
    //if we want to add the mongoose model to the 'definitions' so it is a named model in the swagger ui:
    // definitions: {
    //   event: '', //import your own library, use the 'Model' object in this file.
    //   'event list': { //this library currently configures the return documentation to look for ``${tag} list`
    //     type: 'array',
    //     items: { $ref: '#/definitions/event' }
    //   }
    // }
  };
  app.use('/api/terms', terms);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/terms');

  service.hooks(hooks);
};
