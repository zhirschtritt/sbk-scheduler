module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['plugin:vue/essential'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-param-reassign': [2, { props: false }],
    'vue/max-attributes-per-line': [
      4,
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: true
        }
      }
    ]
  }
};
