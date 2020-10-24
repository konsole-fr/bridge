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
    test('returns table total row count', async () => {
      const res = await request(api).get('/api/tables/users');
      const { count } = res.body;
      expect(count).toEqual(3);
    });

    describe('when given no limit', () => {
      test('returns columns & rows', async () => {
        const res = await request(api).get('/api/tables/bikes');
        const { columns, rows } = res.body;

        expect(res.status).toEqual(200);
        expect(columns).toEqual([
          { name: 'bike_id', type: 'integer', nullable: false, primaryKey: true, hasDefaultValue: true, autoIncrement: true },
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

    describe('when given limit and offset', () => {
      test('returns columns & corresponding rows', async () => {
        const res = await request(api).get('/api/tables/users').query({ limit: 1, offset: 1 });
        const { columns, rows } = res.body;

        expect(res.status).toEqual(200);
        expect(columns).toEqual([
          { name: 'id', type: 'integer', nullable: false, primaryKey: true, hasDefaultValue: true, autoIncrement: true },
          { name: 'email', type: 'text', nullable: false },
          { name: 'password', type: 'text', nullable: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, hasDefaultValue: true },
        ]);
        expect(rows.length).toEqual(1);
        expect(rows[0]).toMatchObject({
          id: 2,
          email: 'sayid.mimouni@gmail.com',
          password: 'said',
        });
      });
    });

    describe('when given sortBy', () => {
      test('returns columns & corresponding rows', async () => {
        const res = await request(api).get('/api/tables/users').query({ sortBy: 'id DESC' });
        const { columns, rows } = res.body;

        expect(res.status).toEqual(200);
        expect(columns).toEqual([
          { name: 'id', type: 'integer', nullable: false, primaryKey: true, hasDefaultValue: true, autoIncrement: true },
          { name: 'email', type: 'text', nullable: false },
          { name: 'password', type: 'text', nullable: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, hasDefaultValue: true },
        ]);
        expect(rows.length).toEqual(3);
        expect(rows[0]).toMatchObject({
          id: 3,
          email: 'sayid.mimouni@gmail.com2',
          password: 'said',
        });
      });
    });

    describe('when given display', () => {
      describe('when display = columns', () => {
        test('returns columns only', async () => {
          const res = await request(api).get('/api/tables/users').query({ display: 'columns' });
          expect(res.status).toEqual(200);
          expect(res.body.rows).toBeUndefined();
          const { columns } = res.body;
          expect(columns).toEqual([
            { name: 'id', type: 'integer', nullable: false, primaryKey: true, hasDefaultValue: true, autoIncrement: true },
            { name: 'email', type: 'text', nullable: false },
            { name: 'password', type: 'text', nullable: false },
            { name: 'created_at', type: 'timestamp without time zone', nullable: false, hasDefaultValue: true },
          ]);
        });
      });
    });

    describe('when given filter', () => {
      test('returns columns & corresponding rows', async () => {
        const res = await request(api).get('/api/tables/users').query({ filter: 'id=1' });
        const { columns, rows } = res.body;
        expect(res.status).toEqual(200);
        expect(columns).toEqual([
          { name: 'id', type: 'integer', nullable: false, primaryKey: true, hasDefaultValue: true, autoIncrement: true },
          { name: 'email', type: 'text', nullable: false },
          { name: 'password', type: 'text', nullable: false },
          { name: 'created_at', type: 'timestamp without time zone', nullable: false, hasDefaultValue: true },
        ]);
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
