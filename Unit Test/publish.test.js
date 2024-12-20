const request = require('supertest'); // import the supertest module to test the API
const app = require('../backend/server'); // import the app from the server file

let server;

beforeAll(async () => {
  // Start the server before running the tests, on port 3000
  server = app.listen(3000);
});

describe('POST /publish', () => {
  it('should fail when role is missing', async () => {
    const publishData = {
      name: 'Test Name', // name is provided
      description: 'This is a test description.', // description is provided
    };

    const response = await request(app)   // send a POST request to the /publish route with the publishData
      .post('/publish')
      .send(publishData);

    // check if the response status is 400 (Bad Request) because 'role' is missing
    expect(response.status).toBe(400);
    // check if the error message indicates 'role' is required
    expect(response.body.message).toBe('Role is required');
  });
});

// close the server after the tests are done
afterAll(async () => {
  await server.close();
});
