module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: ['airbnb-base', 'plugin:vue/strongly-recommended'],
  rules: {
    'no-param-reassign': [2, { props: false }],
    'vue/max-attributes-per-line': [
      4,
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: true,
        },
      },
    ],
  },
};
