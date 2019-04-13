// Initializes the `staffMember` service on path `/staffMembers`
import createService, {StaffMemberService} from './StaffMemberService';
import {Application} from '@feathersjs/express';
const hooks = require('./staffMember.hooks');

export default function(app: Application<any>) {
  const sheets = app.get('sheetsClient');

  const staffMembers = createService(sheets) as StaffMemberService & {
    docs: any;
  };

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
}
