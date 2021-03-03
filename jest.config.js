module.exports = {
  testEnvironment: "./jest/sequelize-environment",
  testMatch: ["**/jest-tests/**/*.test.js"],
  collectCoverageFrom: ["<rootDir>/lib/sequelize-slugify.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
