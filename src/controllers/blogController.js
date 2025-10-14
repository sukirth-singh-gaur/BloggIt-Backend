import asyncHandler from 'express-async-handler';
import Blog from '../models/Blog.js';

/**
 * @desc    Create a new blog post
 * @route   POST /api/blogs
 * @access  Private (Author, Admin)
 */
const createBlog = async (req, res , next) => {
    try {
        const { title, content } = req.body;
    
        if (!title || !content) {
            res.status(400);
            throw new Error('Please provide a title and content');
        }
    
        const blog = new Blog({
            title,
            content,
            author: req.user._id,
        });
    
        const createdBlog = await blog.save();
        res.status(201).json(createdBlog);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Fetch all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
const getAllBlogs = async (req, res, next ) => {
    try {
        const blogs = await Blog.find({}).populate('author', 'name username email').sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Fetch a single blog by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 */
const getBlogById = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name username email');
    
        if (blog) {
            res.json(blog);
        } else {
            res.status(404);
            throw new Error('Blog not found');
        }
    } catch (error) {
        next(error)
    }
};

/**
 * @desc    Update a blog post
 * @route   PUT /api/blogs/:id
 * @access  Private (Author, Admin)
 */
const updateBlog = async (req, res ,next) => {
    try {
        const blog = await Blog.findById(req.params.id);
    
        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        }
    
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('User not authorized to update this blog');
        }
    
        blog.title = req.body.title || blog.title;
        blog.content = req.body.content || blog.content;
    
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/blogs/:id
 * @access  Private (Author, Admin)
 */
const deleteBlog =async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
    
        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        }
    
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('User not authorized to delete this blog');
        }
    
        await blog.deleteOne();
        res.json({ message: 'Blog removed' });
    } catch (error) {
        next(error);
    }
};

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };