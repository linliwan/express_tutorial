# An express.js case tutorial

这是一个express.js的示例项目，旨在搭建一个简易的blog系统，我们将从构建项目脚手架开始，一步步的记录整个项目的搭建过程。
- 使用express.js构建项目，数据库采用SQLite；
- 使用Typescript书写代码；

为了简化，便于初学者理解，本项目计划不采用前后端分离的模式搭建，也就是说一套express.js将同时负责后端的API以及前端的WEB路由构建。
- backend目录为express.js
- frontend目录存放html的设计参考，以及存放为WEB页面写的ts脚本，通过tsc自动转换为js到./backend/public/js目录中，以供ejs调用。

## 这是包含jest测试的版本
- 该版本没有采用tailwind CSS
- 该版本的backend部分包含了jest测试案例，用于对backend/src/db下的代码进行测试，并给出测试报告

```bash
# 安装jest包
cd backend

npm install -D jest ts-jest @types/jest

```
## backend/jest.config.js配置如下：
```javascript
// jest.config.js
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
```
## backend/package.json配置如下：
```json
{
  "name": "backend",
  "scripts": {
    "dev": "tsx watch ./src/index.ts",
    "test": "jest",
    "build": "tsc"
  },
  "type": "module",
  "dependencies": {
    "@types/express": "^5.0.3",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "sqlite": "^5.1.1",
    "sqlite3": "^5.1.7"
  },
  "devDependencies": {
    "@types/jest": "^30.0.0",
    "jest": "^30.2.0",
    "ts-jest": "^29.4.4"
  }
}

```

## 本项目的ConnectionManager.ts相比之前的要复杂一些
- 采用了class进行设计
- 可以先从lite版入手，对比和之前版本使用上的差别
- 为了配合jest测试案例的编写，专门设计了新的ConnectionManager.ts，这个版本可以在new的时候指定环境变量，将开发、生产、测试的数据分开

## 本案例的backend/src/index.ts也进行了新的设计
- 设计了createApp function，可以在启动express的时候选择一些开关：
  - 是否启用api路由
  - 是否启用web路由
  - 指定数据库环境：开发、测试、生产
  - 启动的时候自动初始化sqlite数据库（建表）


## 备注：jest的一些关键字
### test properties:
- only
- skip
- todo

### test alias:
- test
- it
- xit  : it.skip
- fit  : it.only
