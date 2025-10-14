import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog', // Establishes a reference to the Blog model
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Establishes a reference to the User model
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // A self-reference for nested comments
        default: null,
    },
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;