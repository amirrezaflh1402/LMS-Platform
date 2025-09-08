import { Router, Request, Response } from 'express';
import Course from '../models/CourseModel';
import User from '../models/UserModel';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'F727E4';

const router = Router();

// GET /courses - Get all courses
router.get('/courses', async (req: Request, res: Response) => {
    try {
        const courses = await Course.find();
        if (!courses.length) {
            return res.status(404).json({ message: 'No courses found' });
        }
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /courses/:id - Get course detail by ID
router.get('/courses/:id', async (req: Request, res: Response) => {
    try {
        const course = await Course.find({_id: req.params.id});
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /signup - User registration
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /login - User authentication
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id,user }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
export default router;
