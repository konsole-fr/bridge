const postgres = require('../../lib/postgres');

describe('#tables', () => {
  test('returns all the table names from the public schema', async () => {
    const tables = await postgres.tables();
    expect(tables).toEqual(['bikes', 'users']);
  });
});

describe('#table', () => {
  describe('when table does not exist', () => {
    test('rejects', () => {
      return expect(postgres.table('users2')).rejects.toThrow('relation "users2" does not exist');
    });
  });

  describe('when table exists', () => {
    test('returns the table columns', async () => {
      const { columns } = await postgres.table('bikes');
      expect(columns).toEqual([
        { name: 'bike_id', type: 'integer', nullable: false, primaryKey: true },
        { name: 'name', type: 'text', nullable: false },
        { name: 'user_id', type: 'integer', nullable: false, references: 'users#id' },
      ]);
    });

    test('returns table total row count', async () => {
      const { count } = await postgres.table('bikes');
      expect(count).toEqual(1);
    });

    describe('when given no limit nor offset', () => {
      test('returns first 50 table rows', async () => {
        const { rows } = await postgres.table('users');
        expect(rows.length).toEqual(3);
        expect(rows[0]).toMatchObject({
          id: 1,
          password: 'password',
          email: 'admin@gmail.com',
        });
      });
    });

    describe('when given limit and offset', () => {
      test('returns corresponding rows', async () => {
        const { rows } = await postgres.table('users', { limit: 1, offset: 1 });
        expect(rows.length).toEqual(1);
        expect(rows[0]).toMatchObject({
          id: 2,
          password: 'said',
          email: 'sayid.mimouni@gmail.com',
        });
      });

      test('returns table total row count', async () => {
        const { count } = await postgres.table('users', { limit: 1, offset: 1 });
        expect(count).toEqual(3);
      });
    });
  });
});

describe('#query', () => {
  describe('when query failed', () => {
    test('rejects', () => {
      return expect(postgres.query('abc')).rejects.toThrow(/syntax error at or near/);
    });
  });

  describe('when query succeeded', () => {
    test('returns query results in array', async () => {
      const data = await postgres.query('select 1+1 as sum');
      expect(data).toEqual([{ sum: 2 }]);
    });
  });
});
