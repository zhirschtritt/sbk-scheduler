// const {jsWithTs: tsjPreset} = require('ts-jest/presets');

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
};
