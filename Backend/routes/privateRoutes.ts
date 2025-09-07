import { NextFunction, Request, Response,Router } from 'express';
import Course from '../models/CourseModel';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import Enrollment from '../models/EnrollmentModel';

const SECRET_KEY = 'F727E4';
const router = Router();

interface JwtPayload {
 _id?: string;
 name?: string;
 email?: string;
 role?: 'student' | 'instructor' | 'admin';
}

const authenticateToken = async (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token missing' });
        }

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            req.user = user as JwtPayload;
            next();
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

router.post('/courses', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        // Check if user has admin role
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { title, description, price, lessons, quizzes } = req.body;

        if (!title || !description || !price) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // lessons and quizzes should be arrays of ObjectIds referencing Lesson and Quiz models
        const newCourse = new Course({
            title,
            description,
            price,
            lessons: Array.isArray(lessons) ? lessons : [],
            quizzes: Array.isArray(quizzes) ? quizzes : []
        });

        await newCourse.save();

        // Optionally populate lessons and quizzes for response
        const populatedCourse = await Course.findById(newCourse._id)
            .populate('lessons')
            .populate('quizzes');

        res.status(201).json({ message: 'Course created successfully', course: populatedCourse });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
// GET: Dashboard stats
router.get('/dashboard-stats', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const totalCourses = await Course.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRevenueAgg = await Enrollment.aggregate([
            { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'courseData' } },
            { $unwind: '$courseData' },
            { $group: { _id: null, revenue: { $sum: '$courseData.price' } } }
        ]);
        const totalRevenue = totalRevenueAgg[0]?.revenue || 0;

        const enrollmentsPerCourse = await Enrollment.aggregate([
            { $group: { _id: '$course', count: { $sum: 1 } } }
        ]);
        const averageEnrollment = enrollmentsPerCourse.length
            ? enrollmentsPerCourse.reduce((acc, curr) => acc + curr.count, 0) / enrollmentsPerCourse.length
            : 0;

        res.json({
            totalCourses,
            totalUsers,
            totalRevenue,
            averageEnrollment
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// DELETE: Delete course by ID
router.delete('/courses/:id', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { id } = req.params;
        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.json({ message: 'Course deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// PUT: Update course details
router.put('/courses/:id', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { id } = req.params;
        const { title, description, price } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { title, description, price },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.json({ message: 'Course updated successfully.', course: updatedCourse });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
router.get('/users', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const users = await User.find({}, 'name email role');
        const totalUsers = users.length;

        const userDetails = await Promise.all(users.map(async (user: any) => {
            const enrolledCoursesCount = await Enrollment.countDocuments({ user: user._id });
            const completedLessonsCount = user.completedLessons ? user.completedLessons.length : 0;
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                enrolledCoursesCount,
                completedLessonsCount
            };
        }));

        res.json({ totalUsers, users: userDetails });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.delete('/users/:id', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.put('/users/:id/role', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { id } = req.params;
        const { role } = req.body;

        if (!['student', 'instructor', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User role updated successfully.', user: updatedUser });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
router.get('/analytics', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // Get student count per course
        const studentCounts = await Enrollment.aggregate([
            { $group: { _id: '$course', studentsCount: { $sum: 1 } } },
            { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'courseData' } },
            { $unwind: '$courseData' },
            { $project: { _id: 0, courseId: '$courseData._id', title: '$courseData.title', studentsCount: 1 } },
            { $sort: { studentsCount: -1 } }
        ]);

        // Get revenue per course
        const revenueList = await Enrollment.aggregate([
            { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'courseData' } },
            { $unwind: '$courseData' },
            { $group: { _id: '$courseData._id', title: { $first: '$courseData.title' }, revenue: { $sum: '$courseData.price' } } },
            { $project: { _id: 0, courseId: '$_id', title: 1, revenue: 1 } },
            { $sort: { revenue: -1 } }
        ]);

        res.json({
            coursePerformance: studentCounts,
            revenueByCourse: revenueList
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/user-dashboard', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }

        const userId = req.user._id;

        // Get enrolled courses
        const enrollments = await Enrollment.find({ user: userId }).populate('course');
        const enrolledCoursesCount = enrollments.length;

        // Get completed lessons count from user model
        const user = await User.findById(userId);
        const completedLessons = user?.completedLessons || [];
        const completedLessonsCount = completedLessons.length;

        // Get all lessons from enrolled courses
        let totalLessons = 0;
        let totalLearningTime = 0;
        let completedLearningTime = 0;

        for (const enrollment of enrollments) {
            const course: any = enrollment.course;
            if (course && Array.isArray(course.lessons)) {
                totalLessons += course.lessons.length;
                for (const lesson of course.lessons) {
                    totalLearningTime += lesson.duration || 0;
                    if (completedLessons.includes(lesson._id.toString())) {
                        completedLearningTime += lesson.duration || 0;
                    }
                }
            }
        }

        // Calculate overall progress
        const overallProgress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

        res.json({
            enrolledCoursesCount,
            completedLessonsCount,
            totalLessons,
            overallProgress,
            learningTime: completedLearningTime // in minutes or seconds, depending on your lesson model
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
router.get('/users/:id/enrolled-courses', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { id } = req.params;
        const enrollments = await Enrollment.find({ user: id }).populate('course');
        const enrolledCourses = enrollments.map(enrollment => enrollment.course);

        res.json({ enrolledCourses });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});