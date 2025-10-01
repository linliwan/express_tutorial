import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

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
