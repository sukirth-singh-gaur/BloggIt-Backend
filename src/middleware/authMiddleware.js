// backend/src/middleware/authMiddleware.js

import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    if (req.auth && req.auth.userId) {
        try {
            const { userId } = req.auth;
            
            // Check if user exists in MongoDB with this Clerk ID
            let user = await User.findOne({ clerkId: userId });

            if (!user) {
                // If not found by Clerk ID, fetch details from Clerk to check for legacy email match
                const clerkUser = await clerkClient.users.getUser(userId);
                const email = clerkUser.emailAddresses[0]?.emailAddress;

                if (email) {
                    // Check if a legacy user exists with this email
                    user = await User.findOne({ email });

                    if (user) {
                        // Link legacy user to Clerk ID
                        user.clerkId = userId;
                        await user.save();
                    } else {
                        // Create a new user
                        const baseUsername = clerkUser.username || email.split('@')[0];
                        // Ensure username is unique - simple retry or suffix strategy could be better but strict for now
                        // We will try to find if username exists, if so, append random string
                        let username = baseUsername;
                        const userExists = await User.findOne({ username });
                        if (userExists) {
                            username = `${baseUsername}_${Math.floor(Math.random() * 1000)}`;
                        }

                        user = await User.create({
                            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || baseUsername,
                            username: username,
                            email: email,
                            clerkId: userId,
                            role: 'reader', // Default role
                            // No password needed for Clerk users
                        });
                    }
                }
            }
            
            req.user = user;
            next();
            return;

        } catch (error) {
            console.error('Clerk Auth Error:', error);
            res.status(401);
            throw new Error('Not authorized, Clerk token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no valid Clerk session');
    }
});

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`User role '${req.user.role}' is not authorized to access this route`);
        }
        next();
    };
};

export { protect, authorize };