const request = require('supertest');
const api = require('../../api');

describe('GET /tables/:name/records/:id', () => {
  describe('when table does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).get('/api/tables/users2/records/1').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(404);
    });
  });

  describe('when record does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).get('/api/tables/users/records/0').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(404);
    });
  });

  describe('when table & record exist', () => {
    test('returns record', async () => {
      const res = await request(api).get('/api/tables/users/records/1').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      const record = res.body;

      expect(res.status).toEqual(200);
      expect(record).toMatchObject({
        id: 1,
        email: 'admin@gmail.com',
        password: 'password',
      });
    });
  });

  describe('when primary key is not id', () => {
    describe('when record does not exist', () => {
      test('returns 404', async () => {
        const res = await request(api).get('/api/tables/bikes/records/123').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        expect(res.status).toEqual(404);
      });
    });

    describe('when table & record exist', () => {
      test('returns record', async () => {
        const res = await request(api).get('/api/tables/bikes/records/1').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        const record = res.body;

        expect(res.status).toEqual(200);
        expect(record).toMatchObject({
          bike_id: 1,
          name: 'ab',
          user_id: 1,
        });
      });
    });
  });
});

describe('POST /tables/:name/records/:id', () => {
  describe('when table does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).post('/api/tables/users2/records/1').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(404);
    });
  });

  describe('when record does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).post('/api/tables/users/records/0').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(404);
    });
  });

  describe('when table & record exist', () => {
    test('updates record', async () => {
      const res = await request(api).post('/api/tables/users/records/1').send({ email: 'admin2@gmail.com', password: 'password2' }).set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      const record = res.body;

      expect(res.status).toEqual(200);
      expect(record).toMatchObject({
        id: 1,
        email: 'admin2@gmail.com',
        password: 'password2',
      });
    });
  });

  describe('when primary key is not id', () => {
    describe('when record does not exist', () => {
      test('returns 404', async () => {
        const res = await request(api).get('/api/tables/bikes/records/0').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        expect(res.status).toEqual(404);
      });
    });

    describe('when table & record exist', () => {
      test('updates record', async () => {
        const res = await request(api).post('/api/tables/bikes/records/1').send({ name: 'zz' }).set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        const record = res.body;

        expect(res.status).toEqual(200);
        expect(record).toMatchObject({
          bike_id: 1,
          name: 'zz',
          user_id: 1,
        });
      });
    });
  });
});

describe('DELETE /tables/:name/records/:id', () => {
  describe('when table does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).delete('/api/tables/users2/records/1').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(404);
    });
  });

  describe('when record does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).delete('/api/tables/users/records/0').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(404);
    });
  });

  describe('when table & record exist', () => {
    test('deletes record', async () => {
      const res = await request(api).delete('/api/tables/users/records/3').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(204);

      const res2 = await request(api).get('/api/tables/users/records/3').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res2.status).toEqual(404);
    });
  });

  describe('when primary key is not id', () => {
    describe('when record does not exist', () => {
      test('returns 404', async () => {
        const res = await request(api).delete('/api/tables/bikes/records/0').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        expect(res.status).toEqual(404);
      });
    });

    describe('when table & record exist', () => {
      test('deletes record', async () => {
        const res = await request(api).delete('/api/tables/bikes/records/1').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        expect(res.status).toEqual(204);

        const res2 = await request(api).get('/api/tables/bikes/records/1').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
        expect(res2.status).toEqual(404);
      });
    });
  });
});
