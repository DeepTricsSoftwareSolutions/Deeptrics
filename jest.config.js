/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'assets/js/modules/apply-form-payload.js',
    'assets/js/main.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  modulePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/']
};
