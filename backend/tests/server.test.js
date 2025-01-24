const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import your Express app
const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const Publish = require('../models/Publish');

describe('Server Health Check', () => {
    it('should return 404 for root endpoint', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(404); // או סטטוס אחר אם יש לך endpoint שורש אחר
    });
  });

  /*
describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/register').send({
        username: 'testuser',
        password: 'password123',
        role: 'user',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
    });
  });

  
  describe('POST /login', () => {
    it('should login a valid user successfully', async () => {
      const res = await request(app).post('/login').send({
        username: 'testuser',
        password: 'password123',
        role: 'user',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Login successful');
    });
  });
  
*/

beforeAll(async () => {
  // Connect to an in-memory MongoDB instance for testing
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongoServer = await MongoMemoryServer.create();
  mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});


/*
// Test registration functionality
describe('User Registration', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'dogowner',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should return error if username already exists', async () => {
    await User.create({ username: 'testuser', password: 'password123', role: 'dogowner' });

    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'dogowner',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Username already exists');
  });
});

// Test login functionality
describe('User Login', () => {
  it('should log in a valid user', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username: 'testuser', password: hashedPassword, role: 'dogowner' });

    const res = await request(app)
      .post('/login')
      .send({ username: 'testuser', password, role: 'dogowner' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });

  it('should return error for invalid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'nonexistent', password: 'wrongpassword', role: 'dogowner' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid username or password');
  });
});
*/
/*
// Test adding recommendations
describe('Recommendations', () => {
  it('should add a recommendation', async () => {
    const res = await request(app)
      .post('/postRecommendation')
      .send({
        name: 'Test Recommendation',
        description: 'A test description',
        role: 'vet',
        rating: 5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Recommendation added successfully');
  });

  
});

// Test adding businesses (publish functionality)
describe('Publish', () => {
  it('should add a publish entry', async () => {
    const res = await request(app)
      .post('/postPublish')
      .send({
        name: 'Test Business',
        description: 'Business description',
        role: 'dogwalker',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('publish added successfully');
  });

  
});

*/
afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

// נכשל