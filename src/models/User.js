import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['reader', 'author', 'admin'],
        default: 'reader',
    },
}, { timestamps: true });

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  console.log(`Deleting posts and comments for user: ${this._id}`);
  
  // Delete all blogs written by this user
  await Blog.deleteMany({ author: this._id });
  
  // Delete all comments written by this user
  await Comment.deleteMany({ author: this._id });
  
  next();
});

const User = mongoose.model('User', userSchema);
export default User;