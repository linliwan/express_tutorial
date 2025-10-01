const baseDir = '<rootDir>/src';
const baseTestDir = '<rootDir>/src/__tests__';

const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        `${baseDir}/**/*.ts`,
        `!${baseTestDir}/**/*.ts`,
    ],
    testMatch: [
        `${baseTestDir}/**/*.test.ts`
    ]
};

export default config;