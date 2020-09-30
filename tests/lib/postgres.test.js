const postgres = require('../../lib/postgres');

describe('#tables', () => {
  it('returns all the table names from the public schema', async () => {
    const tables = await postgres.tables();
    expect(tables).toEqual(['users', 'bikes']);
  });
});

describe('#table', () => {
  describe('when table does not exist', () => {
    test.skip('rejects', () => {
      return expect(postgres.table('users2')).rejects.toMatch(/relation "users2" does not exist/);
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

    test.only('returns the table rows', async () => {
      const { rows } = await postgres.table('bikes');
      expect(rows.length).toEqual(1);
      expect(rows[0]).toMatchObject({
        bike_id: 1,
        name: 'ab',
        user_id: 1,
      });
    });
  });
});

describe('#query', () => {
  describe('when query failed', () => {
    test.skip('rejects', () => {
      return expect(postgres.query('abc')).rejects.toMatch(/relation "users2" does not exist/);
    });
  });

  describe('when query succeeded', () => {
    test('returns query results in array', async () => {
      const data = await postgres.query('select 1+1 as sum');
      expect(data).toEqual([{ sum: 2 }]);
    });
  });
});
