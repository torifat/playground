/** @type {import('@types/eslint').Linter.ConfigOverride} */
const config = {
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  plugins: ['flowtype', 'jest'],
  rules: {
    'no-console': 'off',
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    'jest/globals': true,
  },
};

module.exports = config;
