const request = require('supertest');
const api = require('../../api');

describe('GET /tables', () => {
  test('returns all tables', async () => {
    const res = await request(api).get('/api/tables').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(['bikes', 'users']);
  });
});
