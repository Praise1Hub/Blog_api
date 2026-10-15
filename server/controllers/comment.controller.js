import { User, Comment, Post } from "../models/index";

// POST /api/posts/:postId/comments (must be logged in)
export const createComment = async (req, res) => {
  try {
    // First check that the post really exists
    const post = await Post.findByPk(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = await Comment.create({
      content: req.body.content,
      postId: post.id,
      userId: req.user.id,
    });

    res.json({ comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// GET /api/posts/:postId/comments
export const getComments = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comments = await Comment.findAll({
      where: { postId: post.id },
      include: { model: User, as: "author", attributes: ["id", "name"] },
      order: [["createdAt", "ASC"]], // oldest first, like a conversation
    });

    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// PUT /api/comments/:id
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    // 1. Validate the new content
    if (!content?.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }
    if (content.trim().length > 1000) {
      return res
        .status(400)
        .json({ error: "Comment cannot exceed 1000 characters" });
    }

    // 2. Make sure the comment exists
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // 3. Only the author can edit (the post owner can delete, but not rewrite someone's words)
    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only edit your own comments" });
    }

    // 4. Save and return the updated comment
    await comment.update({ content: content.trim() });

    const updated = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: "author", attributes: ["id", "username"] }],
    });

    res.json({ message: "Comment updated successfully", updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// DELETE /api/comments/:id (comment owner only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the owner of the comment
    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this comment" });
    }

    await comment.destroy();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
