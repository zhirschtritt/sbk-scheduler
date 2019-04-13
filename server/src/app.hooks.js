// Application hooks that run for every service
import log from './hooks/log';

export const before = {
  all: [log()],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
export const after = {
  all: [log()],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
export const error = {
  all: [log()],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
