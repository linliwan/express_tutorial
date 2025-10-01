import { ConnectionManager } from "./ConnectionManager.ts";
import type { Blog, BlogsResponse } from "../types/blog.ts";
import type { CUDResponse } from "../types/common.ts";

export async function getAllBlogs(offset: number, limit: number): Promise<BlogsResponse> {
    try {
        const db = await ConnectionManager.getConnection();
        const query = `
            SELECT b.id, b.title, b.content, b.img, b.published, b.user_id, b.created_at, u.username
            FROM blogs as b
            JOIN users u on u.id = b.user_id
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?`;
        const blogs = await db.all(query, [limit, offset]);
        const totalBlogs = await db.get("SELECT COUNT(*) as count FROM blogs");
        return { total: totalBlogs.count, data: blogs };
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs");
    }
}

export async function getBlogById(id: number): Promise<Blog | undefined> {
    try {
        const db = await ConnectionManager.getConnection();
        const query = `
            SELECT b.id, b.title, b.content, b.img, b.published, b.user_id, b.created_at, u.username
            FROM blogs as b
            JOIN users u on u.id = b.user_id
            WHERE b.id = ?`;
        const blog = await db.get(query, [id]);
        return blog;
    } catch (error) {
        console.error("Error fetching blog by ID:", error);
        throw new Error("Failed to fetch blog");
    }
}

export async function getBlogsByTagId(tagId: number, offset: number, limit: number): Promise<BlogsResponse> {
    try {
        const db = await ConnectionManager.getConnection();
        const query = `
            SELECT b.id, b.title, b.content, b.img, b.user_id, b.published, b.created_at, u.username
            FROM blogs b
            JOIN users u ON b.user_id = u.id
            JOIN blog_tags bt ON b.id = bt.blog_id
            WHERE bt.tag_id = ?
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?`;
        const blogs = await db.all(query, [Number(tagId), Number(limit), Number(offset)]);
        const totalBlogs = await db.get("SELECT COUNT(*) as count FROM blogs b JOIN blog_tags bt ON b.id = bt.blog_id WHERE bt.tag_id = ?", [Number(tagId)]);
        return { total: totalBlogs.count, data: blogs };
    } catch (error) {
        console.error("Error fetching blogs by tag:", error);
        throw new Error("Failed to fetch blogs by tag");
    }
}

export async function createBlog(title: string, content: string, img: string, userId: number, published: boolean, tags: number[]): Promise<CUDResponse> {
    const db = await ConnectionManager.getConnection();
    
    try {
        // 开始事务
        await db.run("BEGIN TRANSACTION");
        // 1、插入blog
        const result = await db.run(
            "INSERT INTO blogs (title, content, img, user_id, published) VALUES (?, ?, ?, ?, ?)",
            [title, content, img, userId, published ? 1 : 0]
        );
        // 2、为新blog插入tags
        if (tags.length > 0) {
            const insertPromises = tags.map((tagId) =>
                db.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)", [
                    result.lastID as number,
                    tagId,
                ])
            );
            await Promise.all(insertPromises);
        }
        // 提交事务
        await db.run("COMMIT");
        
        if (!result.lastID) {
            throw new Error("Failed to get blog ID after creation");
        }
        return { success: true, message: `Blog id: ${result.lastID} created successfully` };
    } catch (error) {
        // 回滚事务
        try {
            await db.run("ROLLBACK");
        } catch (rollbackError) {
            throw new Error("Failed to create blog and rollback also failed");
        }
        console.error("Error creating blog:", error);
        throw new Error("Failed to create blog");
    }
}

export async function updateBlogById(id: number, title: string, content: string, img: string, userId: number, published: boolean, tags: number[]): Promise<CUDResponse> {
    const db = await ConnectionManager.getConnection();
    
    try {
        // 检查blog是否存在
        const existingBlog = await db.get("SELECT id FROM blogs WHERE id = ?", [id]);
        if (!existingBlog) {
            return { success: false, error: "Blog not found" };
        }

        // 开始事务
        await db.run("BEGIN TRANSACTION");
        
        // 更新blog
        const result = await db.run(
            "UPDATE blogs SET title = ?, content = ?, img = ?, published = ?, user_id = ? WHERE id = ?",
            [title, content, img, published ? 1 : 0, userId, id]
        );
        
        // 更新tags - 先删除旧的，再插入新的
        if (tags && Array.isArray(tags)) {
            await db.run("DELETE FROM blog_tags WHERE blog_id = ?", [id]);
            
            if (tags.length > 0) {
                const insertPromises = tags.map((tagId) =>
                    db.run("INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)", [id, tagId])
                );
                await Promise.all(insertPromises);
            }
        }
        
        // 提交事务
        await db.run("COMMIT");
        
        return { success: true, message: `Blog id: ${id} updated successfully` };
    } catch (error) {
        // 回滚事务
        try {
            await db.run("ROLLBACK");
        } catch (rollbackError) {
            throw new Error("Failed to update blog and rollback also failed");
        }
        console.error("Error updating blog:", error);
        throw new Error("Failed to update blog");
    }
}

export async function deleteBlogById(id: number): Promise<CUDResponse> {
    try {
        const db = await ConnectionManager.getConnection();
        const result = await db.run("DELETE FROM blogs WHERE id = ?", [id]);
        if (result.changes && result.changes > 0) {
            return { success: true, message: "Blog deleted successfully" };
        } else {
            return { success: false, error: "Blog not found" };
        }
    } catch (error) {
        console.error("Error deleting blog:", error);
        throw new Error("Failed to delete blog");
    }
}


