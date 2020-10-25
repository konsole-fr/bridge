const request = require('supertest');
const api = require('../../api');
const credentials = require('../../lib/credentials');

describe('Authorization', () => {
  describe('when no token', () => {
    test('returns 401', async () => {
      const res = await request(api).get('/api/tables');
      expect(res.status).toEqual(401);
    });
  });

  describe('when given token', () => {
    describe('when token is invalid', () => {
      test('returns 401', async () => {
        const res = await request(api).get('/api/tables').set('Authorization', 'invalid token');
        expect(res.status).toEqual(401);
      });
    });

    describe('when token is valid', () => {
      test('passes request to next middleware', async () => {
        const { token } = await credentials.get();
        const res = await request(api).get('/api/tables').set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
      });
    });
  });
});
