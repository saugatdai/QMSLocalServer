module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './tests/testScripts/globalScript.ts',
  globalTeardown: './tests/testScripts/globalScript.ts'
};