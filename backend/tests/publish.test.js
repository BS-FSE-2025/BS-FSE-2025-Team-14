const request = require('supertest');
const app = require('../server');
const Publish = require('../models/Publish');

jest.mock('../models/Publish');

describe('Publish API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /postPublish', () => {
    it('should add a publish', async () => {
      Publish.create.mockResolvedValue({
        name: 'Test Business',
        description: 'Dog walking services',
        role: 'dogwalker',
      });

      const res = await request(app)
        .post('/postPublish')
        .send({
          name: 'Test Business',
          description: 'Dog walking services',
          role: 'dogwalker',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('publish added successfully');
    });

    it('should fail to add a publish with missing fields', async () => {
      const res = await request(app)
        .post('/postPublish')
        .send({ name: 'Test Business' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('All fields are required');
    });
  });

  describe('GET /publish', () => {
    it('should fetch publishes', async () => {
      Publish.find.mockResolvedValue([
        { name: 'Test Business', description: 'Dog walking services', role: 'dogwalker' },
      ]);

      const res = await request(app).get('/publish');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });
});
