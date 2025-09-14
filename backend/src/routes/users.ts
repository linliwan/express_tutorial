import express from "express";
import { getConnection } from "../db/ConnectionManager.ts";

const router = express.Router();

// 查
router.get("/", async (req, res) => {
    const page = Number(req.query.page as string) || 1; // 默认页码为1
    const limit = parseInt(req.query.limit as string) || 3; // 默认每页3条数据，也可以用parseInt替代Number
    const offset = (page - 1) * limit; // 计算偏移量

    try {
        const db = await getConnection(); 
        const users = await db.all("SELECT * FROM users limit ? OFFSET ?", [limit, offset]);
        const totalUsers = await db.get("SELECT COUNT(*) as count FROM users");
        res.json({total: totalUsers.count, data: users});
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// 查单个用户
router.get("/:id", async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const db = await getConnection();
        const query = `
            SELECT u.id, u.username, u.email, u.password, g.name as group_name
            FROM users as u
            JOIN groups as g ON u.group_id = g.id
            WHERE u.id = ?
        `;
        const user = await db.get(query, [userId]);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// 增
router.post("/", async (req, res) => {
    let { username, email, password, group_id = 3 } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ error: "Name, email, and password are required" });
    }
    try {
        const db = await getConnection();
        const result = await db.run(
            "INSERT INTO users (username, email, password, group_id) VALUES (?, ?, ?, ?)",
            [username, email, password, Number(group_id)]
        );
        res.status(201).json({ success: true, id: result.lastID, username, email, group_id });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});


// 删
router.delete("/:id", async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const db = await getConnection();
        const result  = await db.run("DELETE FROM users WHERE id = ?", [userId]);
        console.log(result);
        if (result.changes && result.changes > 0) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});


// 改 - 改密码
router.patch("/:id", async (req, res) => {
    const userId = Number(req.params.id);
    const { password } = req.body;
    if (!password) {
        res.status(400).json({ error: "Password is required" });
    }
    try {
        const db = await getConnection();
        const result = await db.run("UPDATE users SET password = ? WHERE id = ?", [password, userId]);
        if (result.changes && result.changes > 0) {
            res.json({ success: true, message: "Password updated successfully" });
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user password:", error);
        res.status(500).json({ error: "Failed to update user password" });
    }
});

export default router;
