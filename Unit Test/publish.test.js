const request = require('supertest');
const app = require('../backend/server');

let server;

beforeAll(async () => {
  server = app.listen(0);
});

describe('POST /postPublish', () => {
  it('should add a new publish successfully', async () => {
    const newPublish = {
      name: 'Hadar Trabelsi',
      description: 'vet in Beer Sheva',
      role: 'vet',
    };

    // שלח את הבקשה ל-API
    const response = await request(app)
      .post('/postPublish')
      .send(newPublish);

    expect(response.status).toBe(201);
    expect(response.body.publish).toMatchObject(newPublish);
  });
});

afterAll(async () => {
  await server.close();
});
