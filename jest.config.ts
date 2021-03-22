export default {
  clearMocks: true,
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: 'coverage',
  verbose: true
};
