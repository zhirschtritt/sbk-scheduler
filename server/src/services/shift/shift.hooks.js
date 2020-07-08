import Ajv from 'ajv';
const ajv = new Ajv({coerceTypes: true});
import {validateSchema} from 'feathers-hooks-common';
import schema from './shift.schema.json';

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
