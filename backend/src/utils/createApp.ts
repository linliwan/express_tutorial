import express from "express";
import { ConnectionManager } from "../db/ConnectionManager.ts";
import {blogs as apiBlogsRoute} from "../routes/api/index.ts";
import {blogs as webBlogsRoute, admin as webAdminRoute} from "../routes/web/index.ts";

interface Options {
    enableWeb?: boolean;
    enableApi?: boolean;
}

export function createApp(options: Options = {}) {
    // 可以设置是否启用 API 路由和 Web 路由，默认启用 API 路由，禁用 Web 路由
    const { enableApi = true, enableWeb = false } = options;
    const app = express();

    if (enableWeb) {
        app.use(express.static("public"));
        app.set("view engine", "ejs");
        app.set("views", "views");
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 设置路由
    if (enableWeb) {
        app.get("/", (req, res) => {
            res.redirect("/web/blogs");
        });
        app.use("/web/blogs", webBlogsRoute);
        app.use("/web/admin", webAdminRoute);
    }

    if (enableApi){
        app.use("/api/blogs", apiBlogsRoute);
    }
    
    // 处理未找到的路由
    app.use((req, res) => {
        enableWeb && res.status(404).render("error", { title: "Page Not Found", image_name: "404.jpg" });
        // enableWeb 为 false 时，不渲染页面
        !enableWeb && res.status(404).json({ error: "Web not enabled, API mode only" });
    });

    // 当接收到 SIGINT 或 SIGTERM 信号时，优雅地关闭数据库连接
    process.on("SIGINT", async () => {
        console.log("Received SIGINT. Shutting down gracefully...");
        await ConnectionManager.closeConnection();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        console.log("Received SIGTERM. Shutting down gracefully...");
        await ConnectionManager.closeConnection();
        process.exit(0);
    });

    return app;
}