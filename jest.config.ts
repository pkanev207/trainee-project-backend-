import type { Config } from "@jest/types";

const baseDir = "<rootDir>/**/*.ts";
const baseTestDir = "<rootDir>/test/**/*test.ts";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [baseDir],
  testMatch: [baseTestDir ],
};

export default config;
