const request = require('supertest');
const api = require('../../api');

describe('POST /tables/:name/records', () => {
  describe('when table does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).post('/api/tables/bikes2/records').send({
        user_id: 1, name: 'cc',
      }).set('Authorization', 'Bearer azerty');
      expect(res.status).toEqual(404);
    });
  });

  describe('when table exists', () => {
    test('creates record', async () => {
      const res = await request(api).post('/api/tables/bikes/records').send({
        user_id: 1, name: 'cc',
      }).set('Authorization', 'Bearer azerty');
      expect(res.status).toEqual(201);
      const id = res.body.bike_id;
      
      const res2 = await request(api).get(`/api/tables/bikes/records/${id}`).set('Authorization', 'Bearer azerty');
      expect(res2.status).toEqual(200);
    });
  });
});
