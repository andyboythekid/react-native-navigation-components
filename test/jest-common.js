const path = require('path')

module.exports = {
  preset: 'react-native',
  rootDir: path.resolve(__dirname, '..'),
  moduleDirectories: ['node_modules', __dirname],
  transformIgnorePatterns: ['node_modules/(?!(react-native)/)'],
  transform: {
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  collectCoverageFrom: ['**/src/**/*.js'],
  setupFilesAfterEnv: [path.resolve(__dirname, './setup-tests.js')],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}
