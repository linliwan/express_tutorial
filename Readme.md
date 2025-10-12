# An express.js case tutorial

这是一个express.js的示例项目，旨在搭建一个简易的blog系统，我们将从构建项目脚手架开始，一步步的记录整个项目的搭建过程。
- 使用express.js构建项目，数据库采用SQLite；
- 使用tailwind css书写页面的样式；
- 使用Typescript书写代码；

为了简化，便于初学者理解，本项目计划不采用前后端分离的模式搭建，也就是说一套express.js将同时负责后端的API以及前端的WEB路由构建。
- backend目录为express.js
- frontend目录存放html的设计参考，以及存放为WEB页面写的ts脚本，通过tsc自动转换为js到./backend/public/js目录中，以供ejs调用。

我将每一步步骤放在不同的分支中，可以通过切换分支查看每一步的实现过程。

## Backend 部分
1. 搭建项目脚手架
[查看详细文档](./docs/01_backend_init.md)

2. 初始化数据库，编写数据库读写的相关接口
[查看详细文档](./docs/02_backend_database.md)

3. 编写createBlog和updateBlogById两个接口函数，涉及数据库事务
[查看详细文档](./docs/03_backend_database_cont.md)

4. 设计API路由
[查看详细文档](./docs/04_backend_api_routes.md)

5. 设计WEB路由
[查看详细文档](./docs/05_backend_web_routes.md)

## Frontend 部分
6. WEB页面实现
[查看详细文档](./docs/06_web_implement.md)

7. WEB页面实现
[查看详细文档](./docs/07_web_implement.md)

## Backend/Frontend 部分
8. bytag查询页面实现
[查看详细文档](./docs/08_bytag_web_implement.md)

9. admin页面实现
[查看详细文档](./docs/09_admin_web_implement.md)

## 性能优化 部分
10. getAllTags的缓存实现
[查看详细文档](./docs/10_getAlltags_cached.md)
