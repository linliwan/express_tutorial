import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

/**
 * ConnectionManager - 简化版本
 * 单例模式
 */
export class ConnectionManager {
    private db: Database | null = null;
    // 👉 关键点1: 静态实例变量 - 保存唯一的实例
    private static instance: ConnectionManager | null = null;
    // 👉 关键点2: 私有构造函数 - 防止外部直接 new ConnectionManager()
    private constructor() {
        console.log('ConnectionManager 实例被创建！');
    }
    // 👉 关键点3: 静态获取方法 - 控制实例的创建和访问
    public static getInstance(): ConnectionManager {
        if (!this.instance) {
            this.instance = new ConnectionManager();
        }
        return this.instance;
    }

    // 获取数据库连接
    public async getConnection(): Promise<Database> {
        try {
            if (!this.db) {
                // 简化版：直接指定数据库文件名称
                this.db = await open({
                    filename: './data/dev.sqlite',
                    driver: sqlite3.Database,
                });
                // 启用外键约束(SQLite 默认关闭)
                await this.db.exec('PRAGMA foreign_keys = ON;');
                console.log('数据库连接已建立！');
            }
            return this.db;
        } catch (error) {
            throw error;
        }
    }

    // 关闭数据库连接
    public async closeConnection(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = null;
            console.log('数据库连接已关闭！');
        }
    }

}

// 使用示例
// async function demo() {
//     const dbManager = ConnectionManager.getInstance();
//     const db = await dbManager.getConnection();
//     // 执行数据库操作...
//     await dbManager.closeConnection();
// }
    
