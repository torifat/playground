/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'es-jest',
  transformIgnorePatterns: ['node_modules/(?!(is-whitespace-character)/)'],
  testRegex: '/__tests__/(?!__).*',
  bail: true,
  modulePathIgnorePatterns: ['packages/.*/dist'],
  testPathIgnorePatterns: ['/node_modules/', '/packages/.*/dist'],
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  // collectCoverage: true,
};

module.exports = config;
