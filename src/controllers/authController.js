import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
    try {
        const { name, username, email, password, role } = req.body;

        // Use findOne to check for an existing username
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            res.status(400);
            throw new Error('Username Already Taken');
        }

        // Use findOne to check for an existing email
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            res.status(400);
            throw new Error('Email Already Taken');
        }

        const user = await User.create({ name, username, email, password, role });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400);
            throw new Error('Invalid User Data');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res,next) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
    
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.status(200).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/users/logout
 * @access  Private
 */
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
    };
    res.status(200).json(user);
};

export { registerUser, loginUser, logoutUser, getUserProfile };