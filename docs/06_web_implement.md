[返回首页](../Readme.md)

# WEB 页面实现

## blogs 首页

-   重新设计 ejs，将 header 和 footer 抽取出来，放在 views/partial 中；
-   在 home.ejs, error.ejs, blog.ejs 中 include header.ejs 和 footer.ejs；
-   在 frontend 文件夹内写 home.ts 脚本，从 api 获取 blog 信息，然后写到 container div 中去；
-   在 frontend 目录中开启 tsc -w，将 ts 脚本转换到 backend/public/js/中去；
-   设计分页显示按钮，能分页查询 blog

## 单个 blog 的页面

-   现在暂时使用最原始的版本，直接用 JSON.stringify 查看 server rendering 过来的内容即可

## 关于分页按钮的设计

-   本案例是将分页按钮的显示逻辑放到了 frontend/src/tools.ts 中
-   初次编写的时候，可以直接写在 frontend/src/home.ts 中，以后再慢慢模块化；（因为你会发现后面好几个页面都会用到分页按钮的显示，那么不如把这个函数放在一个单独的文件中）
-   要实现分页信息，有几个关键的数字需要把控：
    -   total：blogs 的总数；
    -   limit: 每一页显示的 blog 的数量
    -   offset: 生成每一页按钮的时候，送进去的 offset 都不一样，但总体来说：
        -   第一页：currentOffset = 0
        -   第二页：currentOffset = 0 + limit \* 1
        -   第三页：currentOffset = 0 + limit \* 2
        -   第四页：currentOffset = 0 + limit \* 3
        -   ... 所以每一页的 offset 和页数是有关系的，数学表达是
        -   currentOffset = limit \* (currentPage - 1)
        -   currentPage = (currentOffset / limit) + 1;
    -   totalPages：总页数，可以根据 total 和 limit 计算得到，数学表达：Math.ceil(total / limit)
-   为了用户体验，一般在网页上只会显示有限数量的分页按钮，例如，假使总共有 100 页，那么分页按钮仅显示当前最近的 5 页（参考下面的 blog 首页效果图）；
    -   这就需要根据 currentPage 来计算第一个按钮 startPage 的数字和最后一个按钮 endPage 的数字；
    -   尽可能让 currentPage 显示在最中间，那么 startPage = currentPage - 2；
    -   endPage = startPage + 4；
    -   如果算得的 endPage > totalPages，则 endPage = totalPages；
    -   如果算得的 startPage < 0，则 startPage = 1；
-   以上逻辑不必期望一下子全部考虑周全，可以结合测试，分步骤实现，例如先实现页面上显示所有的 page button，并且正确导航到对应的 page，然后想办法实现只显示最近的 5 个 page button；

## 插入海量测试数据

-   为方便后续测试，需要大量的 blog 以及 blog_tags 记录，我已经在 sql 脚本中准备好了测试数据；
-   用 dataGrip 打开 backend/data/dev.sqlite, 运行 backend/data/console.sql 中的“第四 - 海量 blog 数据 - 供测试”部分；

## 目前实施效果如下：

-   首页
    ![blog首页效果](./step06-01.png)
-   单 blog 页
    ![单blog页效果](./step06-02.png)
-   404 页
    ![404页效果](./step06-03.png)
