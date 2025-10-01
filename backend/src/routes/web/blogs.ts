import express from 'express';
import { getAllTagsCached, getTagsByBlogId } from '../../db/tags.ts';
import { getBlogById } from '../../db/blogs.ts';
import type { Tag } from '../../types/tag.ts';
import type { Blog } from '../../types/blog.ts';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tags: Tag[] = await getAllTagsCached();
        res.render('index', { title: 'Easy Blog - Home', script_name: 'index.js', tags });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).render('error', { title: 'Error', image_name: '500.png' });
    }
});

router.get('/tags', async (req, res) => {
    const tag = Number(req.query.tag);
    try {
        const tags: Tag[] = await getAllTagsCached();
        let tagName: string = tags.find((t: any) => t.id === tag)?.name || 'Unknown';
        res.render('index', { title: `Easy Blog - ${tagName}`, script_name: 'tag.js', tags });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).render('error', { title: 'Error', image_name: '500.png' });
    }
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const tags: Tag[] = await getAllTagsCached();
        const blog: Blog | undefined = await getBlogById(id);
        const blogTags: Tag[] = await getTagsByBlogId(id);
        if (blog) {
            res.render('blog', { title: `Easy Blog - ${blog.title}`, tags, blog, blogTags });
        } else {
            res.status(404).render('error', { title: 'Error', image_name: '404.jpg' });
        }
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).render('error', { title: 'Error', image_name: '500.png' });
    }
});

export default router;