// backend/src/index.js

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';



import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'; // Import the new route
import languageToolRoutes from "./routes/languageToolRoutes.js";

dotenv.config();

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:3000',
    'https://project-bloggit.vercel.app'], //frontend URL
    credentials: true,
    //Setting credentials: true tells the browser that it is safe to send 
    // "credentials"—like cookies, authorization headers, or TLS client 
    // certificates—with the cross-origin requests the frontend makes.
}));
//Without credentials: true, the browser would not attach the jwt cookie to the API requests. 
// Your backend would receive the request without any authentication information and would 
// reject it with a 401 Unauthorized error, even if the user had previously logged in successfully.

// Body parser middleware
app.use(express.json({ limit: "20kb" }));
//This middleware is responsible for parsing incoming requests with JSON payloads. 
// When your React frontend sends data to your API 
// (for example, when a user registers or creates a blog post), 
// it typically sends the data as a JSON string in the request body.
app.use(express.urlencoded({ extended: true }));
//This middleware is similar to express.json() but is used for parsing incoming 
// requests with URL-encoded payloads. This is the default data format that 
// traditional HTML forms use when they are submitted.


// Cookie parser middleware
app.use(cookieParser());
//This middleware parses the Cookie header from incoming requests and attaches the cookies as a convenient object to req.cookies.
//This is essential for your application's authentication system. 
// When a logged-in user makes a request, their browser sends the jwt cookie 
// in the request headers. cookieParser() reads this header and makes the token 
// available at req.cookies.jwt, allowing your protect middleware to access 
// and verify it.

// API Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', authRoutes);
app.use('/api/blogs', blogRoutes);
// The comment routes are nested under blogs
app.use('/api/blogs', commentRoutes);
app.use('/api/upload', uploadRoutes); 
app.use("/api", languageToolRoutes);


// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => console.log(`Server running on port ${port}`));