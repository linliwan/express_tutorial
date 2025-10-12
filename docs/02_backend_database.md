[返回首页](../Readme.md)

# 数据库设计及相关接口编写

## 数据库设计
- 首先用DataGrip在 backend/data 目录中新建一个dev.sqlite文件；
- 数据库设计详见 backend/data/console.sql，运行相关命令，建表，并插入测试数据；
- 使用DataGrip测试基本的增删改查；

## src/types目录
- 存放本项目所有的interface定义，并统一使用index.ts导出

## ConnectionManager.ts
- 提供getConnect和closeConnection函数，用于打开和关闭数据库

## dbBlog.ts
- 提供getAllBlogs、getBlogById、getBlogsByTagId、deleteBlogById接口函数

## dbTag.ts
- 提供getAllTags、getTagsByBlogId接口函数

## dbUser.ts
- 应该提供针对users表的相关增删改查接口，为简化教学，本案例暂不涉及

## temp_test.ts
- 调用前面编写的相关接口函数进行测试，看是否满足要求，仅用于初始开发过程中对函数进行简单的测试，后面我们会改写成正式的jest测试案例
- 调用temp_test.ts对代码进行测试，例如：

```bash
wesker@wesker-lenovo /d/CODE/bootcamp_ag/init/11_easy_blog/backend (step02)
$ tsx ./src/db/temp_test.ts 
[
  { id: 1, name: 'Technical' },
  { id: 2, name: 'Life' },
  { id: 3, name: 'Education' }
]
```
