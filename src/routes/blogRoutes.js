import express from 'express';
const router = express.Router();
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// @route   /api/blogs

router.route('/')
    // Anyone can view all blogs
    .get(getAllBlogs)
    // Only logged-in authors or admins can create a blog
    .post(protect, authorize('author', 'admin'), createBlog);

router.route('/:id')
    // Anyone can view a single blog by its ID
    .get(getBlogById)
    // Only the author of the post or an admin can update it
    .put(protect, authorize('author', 'admin'), updateBlog)
    // Only the author of the post or an admin can delete it
    .delete(protect, authorize('author', 'admin'), deleteBlog);

export default router;