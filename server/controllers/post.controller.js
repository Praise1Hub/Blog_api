import { Post, User } from "../models/index.js"

//Reusable setting: when we load a post,also load its author,
//but only the id and name (never the email or password)
const includeAuthor = {
    model: User,
    as: 'author',
    attributes: ['id', 'name'],
};

//POST /api/posts (must be logged in)
export const createPost = async (req, res) => {
    try {
        const { title, content, published } = req.body;

        const post = await Post.create({
            title,
            content,
            published,
            userId: req.user.id, // comes from the auth middleware
        });

        res.status(201).json({ post });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Invalid data',
                details: error.errors.map((e) => e.message),
            });
        }
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// GET /api/posts/:id
export const getPost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: includeAuthor,
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// PUT /api/posts/:id (owner only)
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Ownership check: is the logged-in user the one who wrote this post?
        if (post.userId !== req.user.id) {
            return res.status(403).json({ error: 'You can only edit your own posts'});
        }

        // Only update the fields the user actually sent
        const changes = {};
        ['title', 'content', 'published'].forEach((field) => {
            if (req.body[field] !== undefined) {
                changes[field] = req.body[field];
            }
        });

        await post.update(changes);

        res.json({ post });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Invalid data',
                details: error.errors.map((e) => e.message),
            });
        }
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// DELETE /api/posts/:id (owner only)
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await post.destroy();

        res.json({ message: 'Post deleted' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something wennt wrong' });
}
};