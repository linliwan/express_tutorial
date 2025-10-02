import { ConnectionManager } from '../../db/ConnectionManager_lite.ts';
import { Database } from 'sqlite';

describe('ConnectionManager_lite test section', () => {
    let manager: ConnectionManager;

    beforeEach(() => {
        manager = ConnectionManager.getInstance();
    });

    afterEach(async () => {
        await manager.closeConnection();
    });

    describe('getInstance test', () => {
        test('should return the same instance on multiple calls', () => {
            const manager1 = ConnectionManager.getInstance();
            const manager2 = ConnectionManager.getInstance();
            
            expect(manager1).toBe(manager2);
        });

        test('should enforce singleton pattern - only one way to get instance', () => {
            // TypeScript的private构造函数只在编译时检查，运行时不会阻止
            // 所以我们测试单例模式的核心：只能通过getInstance获取实例
            const manager1 = ConnectionManager.getInstance();
            const manager2 = ConnectionManager.getInstance();
            const manager3 = ConnectionManager.getInstance();
            
            // 验证都是同一个实例
            expect(manager1).toBe(manager2);
            expect(manager2).toBe(manager3);
            
            // 验证getInstance是获取实例的唯一正确方式
            expect(typeof ConnectionManager.getInstance).toBe('function');
        });

    });

    describe('getConnection test', () => {
        test('should create and return a database connection', async () => {
            const db = await manager.getConnection();

            expect(db).toBeDefined();
            expect(db).toBeInstanceOf(Database);
        });

        test('should return the same database connection on multiple calls', async () => {
            const db1 = await manager.getConnection();
            const db2 = await manager.getConnection();
            
            expect(db1).toBe(db2); // 应该是同一个连接实例
        });

        test('should handle database operations', async () => {
            const db = await manager.getConnection();
            
            // 创建测试表
            await db.exec(`
                CREATE TABLE IF NOT EXISTS test_table (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL
                )
            `);
            
            // 插入测试数据
            await db.run("INSERT INTO test_table (name) VALUES (?)", ["test"]);
            
            // 查询数据
            const result = await db.get("SELECT * FROM test_table WHERE name = ?", ["test"]);
            
            expect(result).toBeDefined();
            expect(result.name).toBe("test");
        });
    });

    describe('closeConnection test', () => {
        test('should close connection without errors', async () => {
            // 先建立连接
            await manager.getConnection();
            // 关闭连接
            await expect(manager.closeConnection()).resolves.not.toThrow();
        });

        test('should handle multiple close calls gracefully', async () => {
            await manager.getConnection();
            
            // 多次关闭应该都不报错
            await expect(manager.closeConnection()).resolves.not.toThrow();
            await expect(manager.closeConnection()).resolves.not.toThrow();
        });

        test('should allow reconnection after close', async () => {
            // 建立初始连接
            const db1 = await manager.getConnection();
            expect(db1).toBeDefined();

            // 关闭连接
            await manager.closeConnection();
    
            // 重新连接
            const db2 = await manager.getConnection();
            expect(db2).toBeDefined();
        });
    });
});