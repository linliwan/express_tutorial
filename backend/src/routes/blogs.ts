import express from "express";
import { getConnection } from "../db/ConnectionManager.ts";

const router = express.Router();

// 查
router.get("/", async (req, res) => {
    const offset = Number(req.query.offset as string) || 0; // 默认从第1条数据开始
    const limit = Number(req.query.limit as string) || 6; // 默认每页6条数据
    try {
        const db = await getConnection(); 
        const blogs = await db.all("SELECT * FROM blogs ORDER BY created_at DESC LIMIT ? OFFSET ?", [limit, offset]);
        const totalBlogs = await db.get("SELECT COUNT(*) as count FROM blogs");
        res.json({ total: totalBlogs.count, data: blogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// 根据tag查blog
router.get("/tag/:tag", async (req, res) => {
    const tag = req.params.tag;
    const { offset = 0, limit = 10 } = req.query;

    try {
        const db = await getConnection();
        const query = `
            SELECT b.id, b.title, b.img, b.user_id, b.published, b.created_at, u.username
            FROM blogs b
            JOIN users u ON b.user_id = u.id
            JOIN blog_tags bt ON b.id = bt.blog_id
            WHERE bt.tag_id = ?
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?
        `;
        const blogs = await db.all(query, [Number(tag), Number(limit), Number(offset)]);
        const totalBlogs = await db.get("SELECT COUNT(*) as count FROM blogs b JOIN blog_tags bt ON b.id = bt.blog_id WHERE bt.tag_id = ?", [Number(tag)]);
        if (blogs.length > 0) {
            res.json({ total: totalBlogs.count, data: blogs });
        } else {
            res.status(404).json({ error: "No blogs found for this tag" });
        }
    } catch (error) {
        console.error("Error fetching blogs by tag:", error);
        res.status(500).json({ error: "Failed to fetch blogs by tag" });
    }
});



// 查单个blog
router.get("/:id", async (req, res) => {
    const blogId = Number(req.params.id);
    try {
        const db = await getConnection();
        const query = `
            SELECT * FROM blogs WHERE id = ?
        `;
        const blog = await db.get(query, [blogId]);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ error: "Blog not found" });
        }
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ error: "Failed to fetch blog" });
    }
});



// 删
router.delete("/:id", async (req, res) => {
    const blogId = Number(req.params.id);
    try {
        const db = await getConnection();
        const result  = await db.run("DELETE FROM blogs WHERE id = ?", [blogId]);
        console.log(result);
        if (result.changes && result.changes > 0) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).json({ error: "Blog not found" });
        }
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ error: "Failed to delete blog" });
    }
});


// 增
router.post("/", async (req, res) => {
    let { title, content, img, published = 1, user_id, tags } = req.body;
    if (!title || !content || !user_id || !img) {
        res.status(400).json({ error: "Title, content, user_id and img are required" });
    }
    try {
        const db = await getConnection();
        const result = await db.run(
            "INSERT INTO blogs (title, content, img, published, user_id ) VALUES (?, ?, ?, ?, ?)",
            [title, content, img, published, user_id]
        );

        // 插入tags
        if (tags && Array.isArray(tags)) {
            const insertPromises = tags.map(tagId => 
                db.run(
                    "INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)",
                    [result.lastID, tagId]
                )
            );
            await Promise.all(insertPromises);
        }

        res.status(201).json({ success: true, id: result.lastID, title, published, user_id, img });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ error: "Failed to create blog" });
    }
});


// 改
router.patch("/:id", async (req, res) => {
    const blogId = Number(req.params.id);
    let { title, content, img, published, user_id, tags } = req.body;
    // console.log("Received data for update:", req.body);
    // 检查必填字段
    if (!title || !content || !user_id || !img) {
        res.status(400).json({ error: "Title, content, user_id and img are required" });
    }
    try {
        const db = await getConnection();
        const result = await db.run("UPDATE blogs SET title = ?, content = ?, img = ?, published = ?, user_id = ? WHERE id = ?", [title, content, img, published, user_id, blogId]);
        // 更新tags
        if (tags && Array.isArray(tags)) {
            // 首先删除旧的tags
            await db.run("DELETE FROM blog_tags WHERE blog_id = ?", [blogId]);
            // 然后插入新的tags
            const insertPromises = tags.map(tagId => 
                db.run(
                    "INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)",
                    [blogId, tagId]
                )
            );
            await Promise.all(insertPromises);
        }

        if (result.changes && result.changes > 0) {
            res.json({ success: true, message: "Blog updated successfully" });
        } else {
            res.status(404).json({ error: "Blog not found" });
        }
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ error: "Failed to update blog" });
    }
});

export default router;
