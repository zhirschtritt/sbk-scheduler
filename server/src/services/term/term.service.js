// Initializes the `term` service on path `/terms`
import createService from './term.class.js';
import hooks from './term.hooks';

export default function(app) {
  const paginate = app.get('paginate');

  const sheets = app.get('sheetsClient');

  const options = {
    paginate,
    sheets,
  };

  // Initialize our service with any options it requires
  // app.use('/terms', createService(options));
  const terms = createService(options);
  terms.docs = {
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
      terms: require('./term.schema'),
    },
  };
  app.use('/terms', terms);

  // Get our initialized service so that we can register hooks
  const service = app.service('terms');

  service.hooks(hooks);
}
