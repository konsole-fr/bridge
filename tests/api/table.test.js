const request = require('supertest');
const api = require('../../api');

describe('GET /tables/:name', () => {
  describe('when table does not exist', () => {
    test('returns 404', async () => {
      const res = await request(api).get('/api/tables/users2');
      expect(res.status).toEqual(404);
    });
  });

  describe('when table exists', () => {
    test('returns columns & rows', async () => {
      const res = await request(api).get('/api/tables/bikes');
      const { columns, rows } = res.body;

      expect(res.status).toEqual(200);
      expect(columns).toEqual([
        { name: 'bike_id', type: 'integer', nullable: false, primaryKey: true },
        { name: 'name', type: 'text', nullable: false },
        { name: 'user_id', type: 'integer', nullable: false, references: 'users#id' },
      ]);
      expect(rows.length).toEqual(1);
      expect(rows[0]).toMatchObject({
        bike_id: 1,
        name: 'ab',
        user_id: 1,
      });
    });
  });
});
