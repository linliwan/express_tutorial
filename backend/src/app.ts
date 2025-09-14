import express from "express";
import { gracefulShutdown } from "./utils/shutdownConnection.ts";
import userRoutes from "./routes/users.ts";
import blogRoutes from "./routes/blogs.ts";
import pageRoutes from "./routes/pages.ts";
import adminRoutes from "./routes/admin.ts";

const app = express();
const PORT = 8012;

app.use(express.static("public")); // 提供静态文件服务
app.set("view engine", "ejs"); // 设置 EJS 作为模板引擎
app.set("views", "views"); // 设置视图目录

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("/pages");
});

// 设置路由
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/pages", pageRoutes);
app.use("/admin", adminRoutes);


// 处理未找到的路由
app.use((req, res) => {
    res.status(404).render("error", {image_name: "404.jpg", title: "Page Not Found"});
});

// 当接收到 SIGINT 或 SIGTERM 信号时，优雅地关闭数据库连接
gracefulShutdown();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
