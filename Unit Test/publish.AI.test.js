const request = require('supertest');
const app = require('../app'); // Adjust the path to your app

describe('POST /postPublish', () => {
    it('should return status 201 with the correct response body', async () => {
        const newPublish = {
            title: 'Test Title',
            content: 'Test Content'
        };

        const response = await request(app)
            .post('/postPublish')
            .send(newPublish)
            .expect(201);

        expect(response.body).toEqual(expect.objectContaining(newPublish));
    });
});