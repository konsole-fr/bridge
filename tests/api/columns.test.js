const request = require('supertest');
const api = require('../../api');

describe('GET /tables/:name/columns', () => {
  describe('when table does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).get('/api/tables/users2/columns').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      expect(res.status).toEqual(404);
    });
  });

  describe('when table exists', () => {
    test('returns columns', async () => {
      const res = await request(api).get('/api/tables/bikes/columns').set('Authorization', 'Bearer azerty').set('X-Requested-With', 'XMLHttpRequest');
      const { columns } = res.body;
      expect(res.status).toEqual(200);
      expect(columns).toEqual([
        { name: 'bike_id', type: 'integer', nullable: false, primaryKey: true, hasDefaultValue: true, autoIncrement: true },
        { name: 'name', type: 'text', nullable: false },
        { name: 'user_id', type: 'integer', nullable: false, references: 'users#id' },
      ]);
    });
  });
});
