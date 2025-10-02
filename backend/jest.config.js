const baseDir = '<rootDir>/src/db';
const baseTestDir = '<rootDir>/src/__tests__';

const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        `${baseDir}/**/*.ts`,
        // 排除不需要测试的文件
        `!${baseTestDir}/**/*.ts`,           // 排除测试文件
        `!${baseDir}/**/index.ts`,           // 排除所有 index.ts 文件
        `!${baseDir}/config.ts`,             // 排除配置文件
        `!${baseDir}/types/**/*.ts`,         // 排除类型定义文件
    ],
    testMatch: [
        `${baseTestDir}/**/*.test.ts`
    ]
};

export default config;