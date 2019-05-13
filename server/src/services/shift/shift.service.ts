// Initializes the `shift` service on path `/shifts`
import {ShiftService} from './ShiftService';
import hooks from './shift.hooks';
import {ShiftRepository} from './ShiftRepository';
import {Application} from '@feathersjs/express';

export default function(app: Application<any>) {
  const sheets = app.get('sheetsClient');
  const repository = new ShiftRepository(sheets);

  const shifts = new ShiftService(repository);

  (shifts as any).docs = {
    find: {
      parameters: [
        {
          description: 'Number of results to return',
          in: 'query',
          name: '$limit',
          type: 'integer',
        },
        {
          description: 'Number of results to skip',
          in: 'query',
          name: '$skip',
          type: 'integer',
        },
        {
          description: 'Property to sort results',
          in: 'query',
          name: '$sort',
          type: 'string',
        },
        {
          description: 'Property to query results',
          in: 'query',
          name: '$search',
          type: 'string',
        },
      ],
    },
    definitions: {
      shifts: require('./shift.schema'),
    },
  };

  app.use('/shifts', shifts);

  const service = app.service('shifts');

  service.hooks(hooks);
}
