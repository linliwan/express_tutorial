import { getConnection } from "./ConnectionManager.ts";

export async function getBlogById(id: number) {
    try {
        const db = await getConnection();
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
