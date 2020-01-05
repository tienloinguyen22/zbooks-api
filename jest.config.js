module.exports = {
  preset: '',
  transformIgnorePatterns: ['/core-js/', '/@babel/runtime/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  collectCoverageFrom: ['src/**/*.[jt](s|sx)'],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    // ... other setup files ...
  ],
  resetMocks: true,
  resetModules: true,
  testRegex: '\\.(test|spec)\\.[jt](s|sx)?$',
  testEnvironment: 'node',
};
