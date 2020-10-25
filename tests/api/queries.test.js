const request = require('supertest');
const api = require('../../api');

describe('POST /queries', () => {
  describe('when query is missing', () => {
    test('returns 400', async () => {
      const res = await request(api).post('/api/queries').set('Authorization', 'Bearer azerty');
      expect(res.status).toEqual(400);
    });
  });

  describe('when query is invalid', () => {
    test('returns 500', async () => {
      const res = await request(api).post('/api/queries').send({ sql: 'azerty' }).set('Authorization', 'Bearer azerty');
      expect(res.status).toEqual(500);
    });
  });

  describe('when query is valid', () => {
    test('returns the query results', async () => {
      const res = await request(api).post('/api/queries').send({ sql: 'select 1+1 as sum' }).set('Authorization', 'Bearer azerty')
      expect(res.status).toEqual(200);
      expect(res.body).toEqual([{ sum: 2 }]);
    });
  });
});
