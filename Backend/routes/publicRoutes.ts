import { Router, Request, Response } from 'express';
import Course from '../models/CourseModel';


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


export default router;
