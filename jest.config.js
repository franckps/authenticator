module.exports = {
  roots: ["<rootDir>"],
  clearMocks: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/domain/**",
    "!<rootDir>/src/main/**",
    "!<rootDir>/src/**/protocols/**",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
