module.exports = {
  testEnvironment: "./jest/sequelize-environment",
  testMatch: ["**/jest-tests/**/*.test.js"],
  collectCoverageFrom: ["<rootDir>/lib/sequelize-slugify.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"]
};
