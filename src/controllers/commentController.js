import asyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

/**
 * @desc    Create a new comment on a blog
 * @route   POST /api/blogs/:blogId/comments
 * @access  Private
 */
const createComment = async (req, res, next) => {
  try {
    const { text, parentCommentId } = req.body;
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }

    const comment = new Comment({
      text,
      blog: blogId,
      author: req.user._id,
      parentComment: parentCommentId || null,
    });

    const createdComment = await comment.save();
    res.status(201).json(createdComment);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all comments for a blog
 * @route   GET /api/blogs/:blogId/comments
 * @access  Public
 */
const getCommentsForBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .populate("author", "name username")
      .sort({ createdAt: "asc" });

    const commentMap = {};
    const nestedComments = [];

    comments.forEach((comment) => {
      const commentObj = comment.toObject();
      commentObj.children = [];
      commentMap[commentObj._id] = commentObj;
    });

    comments.forEach((comment) => {
      const commentObj = commentMap[comment._id];
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.children.push(commentObj);
        }
      } else {
        nestedComments.push(commentObj);
      }
    });

    res.json(nestedComments);
  } catch (error) {
    next(error);
  }
};

export { createComment, getCommentsForBlog };
