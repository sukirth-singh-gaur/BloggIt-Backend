import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String, // Can also be mongoose.Schema.Types.Mixed for complex Quill deltas
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Establishes a reference to the User model
    },
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;