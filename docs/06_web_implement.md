[返回首页](../Readme.md)

# WEB页面实现


## blogs首页
- 重新设计ejs，将header和footer抽取出来，放在views/partial中；
- 在home.ejs, error.ejs, blog.ejs中 include header.ejs和footer.ejs；
- 在frontend文件夹内写home.ts脚本，从api获取blog信息，然后写到container div中去；
- 在frontend目录中开启tsc -w，将ts脚本转换到backend/public/js/中去；
- 设计分页显示按钮，能分页查询blog

## 单个blog的页面
- 现在暂时使用最原始的版本，直接用JSON.stringify查看server rendering过来的内容即可

## 关于分页按钮的设计
- 本案例是将分页按钮的显示逻辑放到了frontend/src/tools.ts中
- 初次编写的时候，可以直接写在frontend/src/home.ts中，以后再慢慢模块化；（因为你会发现后面好几个页面都会用到分页按钮的显示，那么不如把这个函数放在一个单独的文件中）
- 要实现分页信息，有几个关键的数字需要把控：
  - total：blogs的总数；
  - limit: 每一页显示的blog的数量
  - offset: 生成每一页按钮的时候，送进去的offset都不一样，但总体来说：
    - 第一页：currentOffset = 0
    - 第二页：currentOffset = 0 + limit * 1
    - 第三页：currentOffset = 0 + limit * 2
    - 第四页：currentOffset = 0 + limit * 3  
    - ...  所以每一页的offset和页数是有关系的，数学表达是
    - currentOffset = limit * (currentPage - 1)
    - currentPage = (currentOffset / limit) + 1;
  - totalPages：总页数，可以根据total和limit计算得到，数学表达：Math.ceil(total / limit)
- 为了用户体验，一般在网页上只会显示有限数量的分页按钮，例如，假使总共有100页，那么分页按钮仅显示当前最近的5页（参考下面的blog首页效果图）；
  - 这就需要根据currentPage来计算第一个按钮startPage的数字和最后一个按钮endPage的数字；
  - 尽可能让currentPage显示在最中间，那么startPage = currentPage - 2；
  - endPage = startPage + 4；
  - 如果算得的endPage > totalPages，则endPage = totalPages；
  - 如果算得的startPage < 0，则startPage = 1；
- 以上逻辑不必期望一下子全部考虑周全，可以结合测试，分步骤实现，例如先实现页面上显示所有的page button，并且正确导航到对应的page，然后想办法实现只显示最近的5个page button；

## 目前实施效果如下：
- 首页
![blog首页效果](./step06-01.png)
- 单blog页
![单blog页效果](./step06-02.png)
- 404页
![404页效果](./step06-03.png)