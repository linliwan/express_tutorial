[返回首页](../Readme.md)

# 设计API路由

## src/routes/api目录 
- 新增blogs.ts，采用如下的框架；
```javascript
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.json({message: "blog api route home"});
});

export default router;
```
- 新增index.ts，采用如下的框架：
```javascript
import blogs from "./blogs.ts";

export { blogs };
```

## src/index.ts
- import刚刚配置的api路由，并且设置具体的路径，这个案例中是“/api/blogs”；
- 开启JSON请求体解析支持，app.use(express.json());；
- 顺带也开启URL编码的请求体解析支持，app.use(express.urlencoded({ extended: true }));；
- 设置 处理未找到的路由，即404路由，根据自己的想法定制views/error.ejs；
- 设置 当接收到 SIGINT 或 SIGTERM 信号时，优雅地关闭数据库连接

## 完善src/routes/api/blogs.ts
- 调用上一个环节中写好的db相关的函数，完善blogs相关的rest接口

## 测试
- 可以使用postman进行测试，也可以使用vscode的rest client
- rest client的测试案例，详见 backend/api_test.http

## 至此，API路由已经设计完毕，可以通过rest API对blog进行简单的增删改查了！
