import { getAllTags } from "./tags.ts";
import { closeConnection } from "./ConnectionManager.ts";

async function testOnlyGetAllTags() {
    try {
        const tags = await getAllTags();
        console.log(tags);
    } catch (error) {
        console.error("Error in testOnlyGetAllTags:", error);
    } finally {
        // 关闭数据库连接
        await closeConnection();
    }
}

testOnlyGetAllTags();

// 可以到 11_easy_blog/backend目录，运行 node ./dist/db/test_only.js 来测试函数是否工作正常

// 今后也可以使用jest来编写测试脚本完成批量测试。https://jestjs.io
// Jest 是一个由 Facebook（现 Meta）开发和维护的开源 JavaScript 测试框架，专门用于测试 React 应用，
// 但它也可以用于测试任何 JavaScript/TypeScript 项目（包括 Node.js 后端项目）。
// Jest 集成了 断言（Assertions）、测试运行器（Test Runner） 和 模拟功能（Mocking），不需要额外依赖其他库即可完成完整测试。