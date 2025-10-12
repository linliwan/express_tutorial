# 初始化本项目：
npm init -y
npm install sqlite3 sqlite
npm install express @types/express 
npm install concurrently
npm install ejs

# 本项目教学思路：
- 基于上一章的成果，已经实现了ConnectionManager和express的基础框架
- 本章引入ejs，要实现一个简易的blog系统，通过多种维度展示数据，还需要实现基本的增、删、改

# 任务
- 1、pages.ts的路由设计；
- 2、实现blog首页面的导航条，用server rendering的方式实现，将查询到的tags数据传递给index.ejs；
- 3、实现ejs的模版化，将header、main、footer拆分开来，从而实现复用；
- 4、实现index.ejs的blog展现，blog数据通过fetch获取，然后用client rendring展现在首页；
- 5、在index.ejs上实现paging导航，这一步难度稍高；
- 6、实现基于tag查询blog，并展现，依旧是用client rendering；
- 7、实现单个blog数据的展现，这里采用server rendering，写一个单独的ejs模板；
- 8、admin页面，实现对blogs的增、删、改（有多种方法实现，依据个人喜好，现实中SSR和CSR混用较多，尤其是开发简单、快速的小型应用时）；
- 9、额外任务：自己写路由，实现对users的增、删、改、查


# 能够独立完成本章内容，即意味着
- 已经具备基础的全栈开发能力（前端、后端）；
- 对js、ts已经入门，能够编写较复杂的逻辑，实现客户需求；
- 具备了基础的项目规划能力，能够通过模块化实现可扩展；
- 80%的人坚持不到这里


# 接下来还需要
- 扩展面向对象编程的能力，目的是提高代码阅读理解能力，因为大部分的第三方工具，都是封装成对象的；
- 扩展数据库的认知，sqlite不适合大型项目，但是sql语句是通用的，所以再尝试一款新的数据库软件，试着用代码操控它；
- 很多轮子都是现成的，不用自己徒手造，学会拿来主义，用第三方模块快速实现自己的想法；