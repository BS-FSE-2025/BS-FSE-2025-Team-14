const request = require('supertest');
const app = require('../backend/server');

let server;

beforeAll(async () => {
  server = app.listen(0); // הפעלת השרת לפני כל הבדיקות
});

describe('POST /postRecommendation', () => {
  it('should add a new recommendation successfully', async () => {
    const newRecommendation = {
      name: 'Dr. Cohen',
      description: 'A very experienced veterinarian in Tel Aviv',
      role: 'vet',
      rating: 5,
    };

    // שליחת הבקשה ל-API
    const response = await request(app)
      .post('/postRecommendation')
      .send(newRecommendation);

    // בדיקת תוצאות
    expect(response.status).toBe(201);
    expect(response.body.recommendation).toMatchObject(newRecommendation);
  });

  it('should return an error if a required field is missing', async () => {
    const incompleteRecommendation = {
      name: 'Incomplete Recommendation',
      role: 'vet',
      rating: 5,
    };

    const response = await request(app)
      .post('/postRecommendation')
      .send(incompleteRecommendation);

    // בדיקה שהתוצאה היא שגיאה
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('All fields are required');
  });

  it('should return an error if rating is out of range', async () => {
    const invalidRecommendation = {
      name: 'Invalid Rating',
      description: 'This recommendation has an invalid rating',
      role: 'vet',
      rating: 6, // ציון מחוץ לטווח
    };

    const response = await request(app)
      .post('/postRecommendation')
      .send(invalidRecommendation);

    expect(response.status).toBe(500);
    expect(response.body.error).toContain('Rating cannot exceed 5');
  });
});

afterAll(async () => {
  await server.close(); // סגירת השרת לאחר כל הבדיקות
});
