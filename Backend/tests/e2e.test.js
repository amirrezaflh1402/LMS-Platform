const request = require('supertest');
const app = require('../index');
const User = require('../models/usersModel');
const Post = require('../models/postModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


jest.mock('../models/usersModel.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/postModel.js');

const SECRET_KEY = 'F727E4';

let server;
const PORT = 3000;
beforeAll(() => {
    server = app.listen(PORT);
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});
describe('POST /api/login', () => {
    it('should return 400 if email or password is missing', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({}); // Send empty payload

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 401 if email or password is incorrect', async () => {
        User.findOne.mockResolvedValue(null); // Simulate user not found

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 200 and a token if login is successful', async () => {
        const mockUser = { id: '12345', email: 'test@example.com', password: 'hashedpassword' };
        User.findOne.mockResolvedValue(mockUser); // Simulate user found
        bcrypt.compare.mockResolvedValue(true); // Simulate correct password
        jwt.sign.mockReturnValue('mockToken'); // Simulate token generation

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'correctpassword' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('mockToken');
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: '12345', email: 'test@example.com' },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
    });

    it('should return 500 if an internal error occurs', async () => {
        User.findOne.mockRejectedValue(new Error('Database error')); // Simulate database error

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'password' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to log in');
        expect(response.body.error).toBe('Database error');
    });
});

describe('GET /api/users', () => {
    it('should return 404 if no users are found', async () => {
        User.find.mockResolvedValue([]); // Simulate no users in database

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No users found');
    });

    it('should return 200 and the list of users', async () => {
        const mockUsers = [
            { id: '1', email: 'user1@example.com', name: 'User 1' },
            { id: '2', email: 'user2@example.com', name: 'User 2' },
        ];
        User.find.mockResolvedValue(mockUsers); // Simulate users in database

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
        expect(User.find).toHaveBeenCalledWith({}, '-password');
    });

    it('should return 500 if an internal error occurs', async () => {
        User.find.mockRejectedValue(new Error('Database error')); // Simulate database error

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to fetch users');
        expect(response.body.error).toBe('Database error');
    });
});


// private routes
describe('Authenticated Routes: /api/posts', () => {
    const mockToken = 'mockValidToken';
    const mockUser = { id: '12345', email: 'test@example.com' };

    beforeEach(() => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            if (token === mockToken) {
                callback(null, mockUser);
            } else {
                callback(new Error('Invalid token'));
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/posts', () => {
        it('should return 401 if no token is provided', async () => {
            const response = await request(app).get('/api/posts');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Access token missing');
        });

        it('should return 403 if token is invalid', async () => {
            const response = await request(app)
                .get('/api/posts')
                .set('Authorization', 'Bearer invalidToken');

            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Invalid token');
        });

        it('should return 404 if no posts are found', async () => {
            Post.find.mockResolvedValue([]); // Simulate no posts in database

            const response = await request(app)
                .get('/api/posts')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No posts found');
        });

        it('should return 200 and the list of posts if posts exist', async () => {
            const mockPosts = [
                { id: '1', userId: mockUser.id, title: 'Post 1', body: 'Body 1' },
                { id: '2', userId: mockUser.id, title: 'Post 2', body: 'Body 2' },
            ];
            Post.find.mockResolvedValue(mockPosts); // Simulate posts in database

            const response = await request(app)
                .get('/api/posts')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPosts);
            expect(Post.find).toHaveBeenCalledWith({ userId: mockUser.id });
        });

        it('should return 500 if an internal error occurs', async () => {
            Post.find.mockRejectedValue(new Error('Database error')); // Simulate database error

            const response = await request(app)
                .get('/api/posts')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Failed to fetch posts');
            expect(response.body.error).toBe('Database error');
        });
    });

    describe('POST /api/posts', () => {
        it('should return 401 if no token is provided', async () => {
            const response = await request(app)
                .post('/api/posts')
                .send({ title: 'Test Title', body: 'Test Body' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Access token missing');
        });

        it('should return 403 if token is invalid', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', 'Bearer invalidToken')
                .send({ title: 'Test Title', body: 'Test Body' });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Invalid token');
        });

        it('should return 400 if title or body is missing', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({}); // Missing title and body

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Title and body are required');
        });

        it('should return 201 and the created post if successful', async () => {
            const newPost = {
                id: '1',
                userId: mockUser.id,
                title: 'Test Title',
                body: 'Test Body',
            };
            Post.prototype.save = jest.fn().mockResolvedValue(newPost); // Simulate post save

            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ title: 'Test Title', body: 'Test Body' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual("");
            expect(Post.prototype.save).toHaveBeenCalled();
        });

        it('should return 500 if an internal error occurs', async () => {
            Post.prototype.save = jest.fn().mockRejectedValue(new Error('Database error')); // Simulate save error

            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ title: 'Test Title', body: 'Test Body' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Failed to create post');
            expect(response.body.error).toBe('Database error');
        });
    });
});
