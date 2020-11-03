const request = require('supertest');
const api = require('../../api');
const credentials = require('../../lib/credentials');

describe('Authorization', () => {
  describe('when path = /api/tables', () => {
    test('does not check for xhr', async () => {
      const { token } = await credentials.get();
      const res = await request(api).get('/api/tables').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
    });
  });

  describe('when path = /api/tables/:name/columns', () => {
    test('does not check for xhr', async () => {
      const { token } = await credentials.get();
      const res = await request(api).get('/api/tables/users/columns').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
    });
  });

  describe('when request is post', () => {
    test('does not check for xhr', async () => {
      const { token } = await credentials.get();
      const res = await request(api).post('/api/tables/users/records').send({ email: 'hello@gmail.com', password: 'ok' }).set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(201);
    });
  });

  describe('when request is delete', () => {
    test('does not check for xhr', async () => {
      const { token } = await credentials.get();
      const res = await request(api).delete('/api/tables/bikes/records/1').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(204);
    });
  });

  describe('when request is not xhr', () => {
    test('returns 400', async () => {
      const { token } = await credentials.get();
      const res = await request(api).get('/api/tables/users/records').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(400);
    });
  });

  describe('when request is xhr', () => {
    test('passes request to next middleware', async () => {
      const { token } = await credentials.get();
      const res = await request(api).get('/api/tables/users/records').set('Authorization', `Bearer ${token}`).set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(200);
    });
  });
});
