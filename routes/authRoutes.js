import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json()); // For parsing JSON request bodies

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Verify JWT_SECRET
        console.log('JWT Secret:', process.env.JWT_SECRET);
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'JWT_SECRET is not defined' });
        }

        // Generate JWT token
        const cookie = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token in an HTTP-only cookie
        res.cookie('token', cookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000  // 1 hour
        });

        return res.render('Options')
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a new JWT token
        const cookie = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', cookie, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,  // 1 hour
            sameSite: 'Strict'       // Adjust if needed (consider 'Lax' or 'None' for cross-origin)
        });

        return res.render('Options')
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
