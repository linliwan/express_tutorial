import express from 'express';
// 在这个示例中，我们不打算把sql语句写在路由文件中，而是将其放在单独的db文件中
// 这样可以使代码更清晰，易于维护和测试
import { getAllTags, getTagsByBlogId } from '../db/tags.ts';
import { getBlogById } from '../db/blogs.ts';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tags = await getAllTags();
        res.render('index', { title: 'Easy Blog - Home', script_name: 'index.js', tags });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).render('error', { message: 'Failed to load tags', title: 'Error', image_name: '500.png' });
    }
});

router.get('/tags', async (req, res) => {
    const tag = Number(req.query.tag);
    try {
        const tags = await getAllTags();
        let tagName = tags.find(t => t.id === tag)?.name || 'Unknown';
        res.render('index', { title: `Easy Blog - ${tagName}`, script_name: 'tag.js', tags });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).render('error', { message: 'Failed to load tag', title: 'Error', image_name: '500.png' });
    }
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const tags = await getAllTags();
        const blog = await getBlogById(id);
        const blogTags = await getTagsByBlogId(id);
        // console.log('Blog:', blog, 'Tags:', blogTags);
        res.render('blog', { title: `Easy Blog - ${blog.title}`, tags, blog, blogTags });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).render('error', { message: 'Failed to load tag', title: 'Error', image_name: '500.png' });
    }
});

export default router;