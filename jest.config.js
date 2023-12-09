/** @type {import('ts-jest').JestConfigWithTsJest} */

const typeTest = process.env.JEST_TYPE_TEST == 'unity' ? '<rootDir>/**/*.spec.ts' : '<rootDir>/**/*.test.ts'

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^bcrypt$': '<rootDir>/__mocks__/bcrypt.ts',
  },
  modulePathIgnorePatterns: [
    "<rootDir>/dist/",
    "./node_modules"
  ],
  testMatch: [typeTest]
}  