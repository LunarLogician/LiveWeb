import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './../routes/authRoutes.js'


console.log('All process.env variables:', process.env); // Debugging log

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/src/views'));
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Explicitly load .env

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const URL = process.env.MONGO_URI;

if (!URL) {
    console.error('MONGO_URI is undefined. Check your .env file.');
    process.exit(1);
}

console.log('MongoDB URI:', URL);

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((error) => console.error('MongoDB connection failed:', error));
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => res.render('Home'));
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));

// Handle server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});

export default app;
