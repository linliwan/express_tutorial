import express from 'express';
import { getAllTags, getTagsByBlogId } from '../db/tags.ts';
import { getBlogById } from '../db/blogs.ts';

const router = express.Router();

// 管理员路由
router.get('/blogs', (req, res) => {
    res.render('index', { title: 'Admin Dashboard', script_name: 'admin_blogs.js' });
});

router.get('/blogs/add', async (req, res) => {
    try {
        const tags = await getAllTags();
        res.render('addBlog', { title: 'Add Blog', tags, script_name: 'add_blog.js' });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/blogs/edit/:id', async (req, res) => {
    const blogId = Number(req.params.id);
    try {
        const tags = await getAllTags();
        const blog = await getBlogById(blogId);

        if (!blog) {
            res.status(404).render('error', { image_name: '404.jpg' });
        }
        const blogTags = await getTagsByBlogId(blogId);
        blog.tags = blogTags.map(tag => tag.id); 
        // console.log(blog);
        res.render('editBlog', { title: 'Edit Blog', tags, script_name: 'edit_blog.js', blog });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


export default router;