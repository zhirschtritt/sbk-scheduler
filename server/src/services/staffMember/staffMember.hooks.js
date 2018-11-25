const Ajv = require('ajv');
const ajv = new Ajv({ coerceTypes: true });
const {validateSchema} = require('feathers-hooks-common');
const schema = require('./staffMember.schema');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateSchema(schema, ajv)],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
