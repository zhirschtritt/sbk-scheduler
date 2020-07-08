import Ajv from 'ajv';
const ajv = new Ajv({coerceTypes: true});
import {validateSchema} from 'feathers-hooks-common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import schema from './term.schema.json';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateSchema(schema, ajv)],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
