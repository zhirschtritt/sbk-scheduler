import Ajv from 'ajv';
const ajv = new Ajv({coerceTypes: true});
import {validateSchema} from 'feathers-hooks-common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const schema = require('./term.schema');

export const before = {
  all: [],
  find: [],
  get: [],
  // create: [validateSchema(schema, ajv)],
  update: [],
  patch: [],
  remove: [],
};
export const after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
export const error = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
