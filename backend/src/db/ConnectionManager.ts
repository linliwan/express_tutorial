import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database | null = null;

export async function getConnection(): Promise<Database> {
  try {
    if (!db) {
      db = await open({
        filename: './data/db.sqlite',
        driver: sqlite3.Database,
      });
    }
    return db;
  } catch (error) {
    console.error('Failed to open database connection:', error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    if (db) {
      await db.close();
      db = null;
    }
  } catch (error) {
    console.error('Failed to close database connection:', error);
    // 是否 throw 可以视情况而定，一般在退出流程中打印即可
  }
}


// 另一种写法，封装成class
export class ConnectionManager {
    private static db: Database | null = null;

    public static async getConnection(): Promise<Database> {
        try {
            if (!this.db) {
                this.db = await open({
                    filename: './data/db.sqlite',
                    driver: sqlite3.Database,
                });
            }
            return this.db;
            } catch (error) {
            console.error('Failed to open database connection:', error);
            throw error;
        }
    }

    public static async closeConnection(): Promise<void> {
        try {
            if (this.db) {
                await this.db.close();
                this.db = null;
            }
        } catch (error) {
            console.error('Failed to close database connection:', error);
        }
    }
}
