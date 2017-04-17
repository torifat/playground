module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  plugins: [
    'flowtype',
    'jest'
  ],
  rules: {
    'no-console': 'off'
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    'jest/globals': true
  }
};
