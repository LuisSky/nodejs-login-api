/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^bcrypt$': '<rootDir>/__mocks__/bcrypt.ts',
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"]  
}  