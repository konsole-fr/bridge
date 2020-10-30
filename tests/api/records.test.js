const request = require('supertest');
const api = require('../../api');


describe('GET /tables/:name/records', () => {
  describe('when table does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).get('/api/tables/users2/records').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(404);
    });
  });

  describe('when table exists', () => {
    test('returns table total row count', async () => {
      const res = await request(api).get('/api/tables/users/records').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      const { count } = res.body;
      expect(count).toEqual(3);
    });

    describe('when given no limit', () => {
      test('returns corresponding rows', async () => {
        const res = await request(api).get('/api/tables/bikes/records').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        const { count, rows } = res.body;
        expect(res.status).toEqual(200);
        expect(count).toEqual(1);
        expect(rows.length).toEqual(1);
        expect(rows[0]).toMatchObject({
          bike_id: 1,
          name: 'ab',
          user_id: 1,
        });
      });
    });

    describe('when given limit and offset', () => {
      test('returns corresponding rows', async () => {
        const res = await request(api).get('/api/tables/users/records').query({ limit: 1, offset: 1 }).set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        const { count, rows } = res.body;
        expect(res.status).toEqual(200);
        expect(rows.length).toEqual(1);
        expect(rows[0]).toMatchObject({
          id: 2,
          email: 'sayid.mimouni@gmail.com',
          password: 'said',
        });
      });
    });

    describe('when given sortBy', () => {
      test('returns corresponding rows', async () => {
        const res = await request(api).get('/api/tables/users/records').query({ sortBy: 'id DESC' }).set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        const { count, rows } = res.body;
        expect(res.status).toEqual(200);
        expect(rows.length).toEqual(3);
        expect(rows[0]).toMatchObject({
          id: 3,
          email: 'sayid.mimouni@gmail.com2',
          password: 'said',
        });
      });
    });

    describe('when given filter', () => {
      test('returns columns & corresponding rows', async () => {
        const res = await request(api).get('/api/tables/users/records').query({ filter: 'id:1' }).set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        const { count, rows } = res.body;
        expect(res.status).toEqual(200);
        expect(rows.length).toEqual(1);
        expect(rows[0]).toMatchObject({
          id: 1,
          email: 'admin@gmail.com',
          password: 'password',
        });
      });
    });
  });
});

describe('POST /tables/:name/records', () => {
  describe('when table does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).post('/api/tables/bikes2/records').send({
        user_id: 1, name: 'cc',
      }).set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(404);
    });
  });

  describe('when table exists', () => {
    test('creates record', async () => {
      const res = await request(api).post('/api/tables/bikes/records').send({
        user_id: 1, name: 'cc',
      }).set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(201);
      const id = res.body.bike_id;
      
      const res2 = await request(api).get(`/api/tables/bikes/records/${id}`).set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res2.status).toEqual(200);
    });
  });
});
