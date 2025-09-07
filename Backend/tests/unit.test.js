const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/usersModel');
const Post = require('../models/postModel');

jest.mock('../models/usersModel');

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
    const mockUser = {
        id: '12345',
        email: 'test@example.com',
        password: 'hashedPassword',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if email or password is missing', async () => {
        const response = await request(app).post('/api/login').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 401 for invalid email or password', async () => {
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'wrongPassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 200 and a token for valid login', async () => {
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        const token = 'mockedJwtToken';
        jest.spyOn(jwt, 'sign').mockReturnValue(token);

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'validPassword' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe(token);
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('validPassword', mockUser.password);
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser.id, email: mockUser.email },
            expect.any(String),
            { expiresIn: '1h' }
        );
    });

    it('should return 500 for server errors', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'validPassword' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to log in');
        expect(response.body.error).toBe('Database error');
    });
});

describe('GET /api/users', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and a list of users', async () => {
        const mockUsers = [
            { id: '1', email: 'user1@example.com' },
            { id: '2', email: 'user2@example.com' },
        ];
        User.find.mockResolvedValue(mockUsers);

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
        expect(User.find).toHaveBeenCalledWith({}, '-password');
    });

    it('should return 404 if no users are found', async () => {
        User.find.mockResolvedValue([]);

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No users found');
    });

    it('should return 500 for server errors', async () => {
        User.find.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to fetch users');
        expect(response.body.error).toBe('Database error');
    });
});



// ptivate routes


jest.mock('../models/postModel.js');

const SECRET_KEY = 'F727E4';

describe('Middleware: authenticateToken', () => {
    it('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/api/posts');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Access token missing');
    });

    it('should return 403 if the token is invalid', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        const response = await request(app)
            .get('/api/posts')
            .set('Authorization', 'Bearer invalid_token');

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Invalid token');
    });

    it('should call next() if the token is valid', async () => {
        const mockUser = { id: '12345', email: 'user@example.com' };
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, mockUser);
        });

        const response = await request(app)
            .get('/api/posts')
            .set('Authorization', 'Bearer valid_token');

        expect(jwt.verify).toHaveBeenCalledWith('valid_token', SECRET_KEY, expect.any(Function));
    });
});

describe('GET /api/posts', () => {
    const mockUser = { id: '12345' };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, mockUser);
        });
    });

    it('should return 404 if no posts are found', async () => {
        Post.find.mockResolvedValue([]);

        const response = await request(app)
            .get('/api/posts')
            .set('Authorization', 'Bearer valid_token');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No posts found');
    });

    it('should return 200 and the list of posts', async () => {
        const mockPosts = [
            { id: '1', title: 'Post 1', body: 'Content 1', userId: '12345' },
        ];
        Post.find.mockResolvedValue(mockPosts);

        const response = await request(app)
            .get('/api/posts')
            .set('Authorization', 'Bearer valid_token');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPosts);
        expect(Post.find).toHaveBeenCalledWith({ userId: mockUser.id });
    });

    it('should return 500 for server errors', async () => {
        Post.find.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get('/api/posts')
            .set('Authorization', 'Bearer valid_token');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to fetch posts');
        expect(response.body.error).toBe('Database error');
    });
});

describe('POST /api/posts', () => {
    const mockUser = { id: '12345' };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, mockUser);
        });
    });

    it('should return 400 if title or body is missing', async () => {
        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', 'Bearer valid_token')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Title and body are required');
    });

    it('should return 201 and create a new post', async () => {
        const mockPost = { title: 'New Post', body: 'Content', userId: '12345' };
        Post.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockPost),
        }));

        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', 'Bearer valid_token')
            .send({ title: 'New Post', body: 'Content' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({});
    });

    it('should return 500 for server errors', async () => {
        Post.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('Database error')),
        }));

        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', 'Bearer valid_token')
            .send({ title: 'New Post', body: 'Content' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to create post');
        expect(response.body.error).toBe('Database error');
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});


