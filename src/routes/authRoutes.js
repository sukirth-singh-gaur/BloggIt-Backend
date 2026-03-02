import express from 'express';
const router = express.Router();
import {
    getUserProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

// @route   /api/users

// Protected routes (require a valid Clerk session)
router.get('/profile', protect, getUserProfile);

export default router;