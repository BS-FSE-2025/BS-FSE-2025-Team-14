const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../backend/server');  // מניח שהקובץ נמצא בתיקיית Unit Test
const Recommendation = require('../backend/models/Recommendation');

beforeAll(async () => {
  // וודא שאנחנו מחוברים למונגו לפני הבדיקות
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://yaelle:petpath2024@cluster0.dnotx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
});

beforeEach(async () => {
  // נקה את אוסף ההמלצות לפני כל בדיקה
  await Recommendation.deleteMany({});
});

afterAll(async () => {
  // סגור את החיבור למונגו בסוף כל הבדיקות
  await mongoose.connection.close();
});

describe('Recommendation API Tests', () => {
  
  describe('POST /postRecommendation', () => {
    test('should create a new recommendation with valid data', async () => {
      const validRecommendation = {
        name: 'דר כהן',
        description: 'וטרינר מעולה ומקצועי',
        role: 'vet'
      };

      const response = await request(app)
        .post('/postRecommendation')
        .send(validRecommendation);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Recommendation added successfully');
      expect(response.body.recommendation.name).toBe('דר כהן');
      expect(response.body.recommendation.role).toBe('vet');
    });

    test('should return 400 when missing required fields', async () => {
      const invalidRecommendation = {
        name: 'דר כהן'
        // חסר description ו-role
      };

      const response = await request(app)
        .post('/postRecommendation')
        .send(invalidRecommendation);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
    });

    test('should validate role field', async () => {
      const invalidRecommendation = {
        name: 'דר כהן',
        description: 'וטרינר מעולה',
        role: 'invalid_role'
      };

      const response = await request(app)
        .post('/postRecommendation')
        .send(invalidRecommendation);

      // מצפים לשגיאת ולידציה מהמודל
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to add recommendation');
    });
  });

  describe('GET /recommendations', () => {
    test('should get empty array when no recommendations exist', async () => {
      const response = await request(app)
        .get('/recommendations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(0);
    });

    test('should get all recommendations when they exist', async () => {
      // תחילה נוסיף המלצה
      const testRecommendation = await Recommendation.create({
        name: 'דר כהן',
        description: 'וטרינר מעולה',
        role: 'vet' ,
      });

      const response = await request(app)
        .get('/recommendations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('דר כהן');
    });
  });
});