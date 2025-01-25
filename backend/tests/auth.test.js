const request = require('supertest');
const app = require('../server'); // Your server instance
const User = require('../models/User');
const bcrypt = require('bcrypt');

jest.mock('../models/User');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null); // Simulate no existing user
      User.create.mockResolvedValue({
        username: 'testuser',
        role: 'dogowner',
      });

      const res = await request(app)
        .post('/register')
        .send({ username: 'testuser', password: 'password123', role: 'dogowner' });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
    });

    it('should not register an existing user', async () => {
      User.findOne.mockResolvedValue({ username: 'testuser' }); // Simulate existing user

      const res = await request(app)
        .post('/register')
        .send({ username: 'testuser', password: 'password123', role: 'dogowner' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Username already exists');
    });
  });

  describe('POST /login', () => {
    it('should login a user with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({
        username: 'testuser',
        password: hashedPassword,
        role: 'dogowner',
      });

      const res = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123', role: 'dogowner' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Login successful');
    });

    it('should reject login with invalid credentials', async () => {
      User.findOne.mockResolvedValue(null); // Simulate no user found

      const res = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'wrongpassword', role: 'dogowner' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid username or password');
    });
  });
});


// עבר בדיקה