import express from 'express';
// mergeParams allows us to access params from the parent router (e.g., :blogId)
const router = express.Router({ mergeParams: true });
import {
    createComment,
    getCommentsForBlog,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

// @route   /api/blogs/:blogId/comments

router.route('/:blogId/comments')
    // Anyone can get the comments for a blog
    .get(getCommentsForBlog)
    // Only logged-in users can post a comment
    .post(protect, createComment);

export default router;