const request = require('supertest');
const app = require('../backend/server'); 

let server;

beforeAll(async () => {
  server = app.listen(3000); 
});

describe('POST /postRecommendation', () => {
  it('should add a new recommendation successfully', async () => {
    const newRecommendation = {
      name: 'Dr. John',
      description: 'Experienced vet, highly recommended!',
      role: 'vet',
    };

    // שלח את הבקשה ל-API
    const response = await request(app)
      .post('/postRecommendation')
      .send(newRecommendation);

    // ודא שהסטטוס של התגובה הוא 201
    expect(response.status).toBe(201);
    // ודא שההמלצה שנשלחה קיימת בתגובה
    expect(response.body.recommendation).toMatchObject(newRecommendation);
  });
});

// סגירת השרת אחרי הבדיקות
afterAll(async () => {
  // סגור את השרת
  await server.close();
});
