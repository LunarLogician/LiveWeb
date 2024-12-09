import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from '../routes/authRoutes.js';
import miningRoutes from '../routes/miningRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

const app = express();

// Set the view engine to EJS and fix the views directory path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../src/src/views'));

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', miningRoutes);

const uri = process.env.MONGO_URI;

console.log('MongoDB URI:', uri);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((error) => console.error('MongoDB connection failed:', error));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Routes
app.get('/', (req, res) => {
    res.render('Home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle MongoDB connection cleanup on exit
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});

export default app;
