// Initializes the `term` service on path `/terms`
const hooks = require('./term.hooks');
import {TermsRepository} from './TermsRepository';
import {TermsService} from './term.class';
import {Application} from '@feathersjs/express';

export default function(app: Application<any>) {
  const sheets = app.get('sheetsClient');
  const termsRepo = new TermsRepository(sheets);

  const terms = new TermsService(termsRepo);

  (terms as any).docs = {
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
