const request = require('supertest');
const api = require('../../api');

describe('GET /tables', () => {
  test.skip('returns all tables', async () => {
    const res = await request(api).get('/api/tables');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(['bikes', 'users']);
  });
});
