import express from "express";
import { ConnectionManager } from "../db/ConnectionManager.ts";
import {blogs as apiBlogsRoute} from "../routes/api/index.ts";
import {blogs as webBlogsRoute, admin as webAdminRoute} from "../routes/web/index.ts";
import type { AppOptions } from "../types/index.ts";

export async function createApp(options: AppOptions) {
    // 从配置中获取选项，是否启用api路由和web路由，以及数据库环境
    const { enableApi, enableWeb, env } = options;

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

    // 获取当前环境的数据库实例
    const dbManager = ConnectionManager.getInstance(env); 
    // 初始化数据库表结构
    await dbManager.initializeDatabase();
    // 当接收到 SIGINT 或 SIGTERM 信号时，优雅地关闭数据库连接
    process.on("SIGINT", async () => {
        console.log("Received SIGINT. Shutting down gracefully...");
        await dbManager.closeConnection();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        console.log("Received SIGTERM. Shutting down gracefully...");
        await dbManager.closeConnection();
        process.exit(0);
    });

    return app;
}