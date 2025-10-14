import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

// @route   /api/users

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require a valid JWT)
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);

export default router;