const pgp = require('pg-promise')({});
const credentials = require('./credentials');

let db;

const tables = async () => {
  if (!db) {
    const a = await credentials.get();
    db = pgp(a.url);
  }
  const data = await db.any("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  return data.map(x => x.table_name).sort();
};

const table = async (name, options = {}) => {
  try {
    if (!db) {
      const a = await credentials.get();
      db = pgp(a.url);
    }
    const columnsData = await db.any("SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1", [name]);
    let columns = columnsData.map(x => {
      return {
        name: x['column_name'],
        type: x['data_type'],
        nullable: x['is_nullable'] != 'NO',
      };
    });
    const primaryKeys = await db.any("SELECT c.column_name as column FROM information_schema.key_column_usage AS c LEFT JOIN information_schema.table_constraints AS t ON t.constraint_name = c.constraint_name WHERE t.table_name = $1 AND t.constraint_type = 'PRIMARY KEY'", [name]);
    for (const primaryKey of primaryKeys) {
      columns = columns.map(column => {
        if (column.name == primaryKey.column) {
          return { ...column, primaryKey: true };
        }
        return column;
      });
    }

    const foreignKeys = await db.any("SELECT k.column_name, u.table_name AS foreign_table_name, u.column_name AS foreign_table_column FROM information_schema.table_constraints AS c JOIN information_schema.key_column_usage AS k ON c.constraint_name = k.constraint_name JOIN information_schema.constraint_column_usage AS u ON u.constraint_name = c.constraint_name WHERE c.constraint_type = 'FOREIGN KEY' AND c.table_name = $1;", [name]);
    for (const column of columns) {
      const foreignKey = foreignKeys.find(x => x.column_name == column.name);
      if (foreignKey) {
        column.references = `${foreignKey.foreign_table_name}#${foreignKey.foreign_table_column}`;
      }
    }

    columns = columns.map(column => {
      const data = columnsData.find(x => x.column_name == column.name);
      if (column.primaryKey && data.column_default) {
        return { ...column, hasDefaultValue: true, autoIncrement: true };
      }
      if (data.column_default) {
        return { ...column, hasDefaultValue: true };
      }
      return column;
    });

    const relationships = columns.filter(x => x.references);
    const foreignTables = relationships.map(x => {
      const [table, column] = x.references.split('#');
      return { table, column };
    });

    if (options.columnsOnly) {
      return { columns };
    }
    let query = `SELECT * FROM ${name}`;
    if (options.sortBy) {
      query += ` ORDER BY ${options.sortBy}`;
    }
    if (!options.limit && !options.offset) {
      query += ` LIMIT 50`;
    } else {
      query += ` LIMIT ${options.limit} OFFSET ${options.offset}`;
    }
    const rows = await db.any(query);
    let { count } = await db.one(`SELECT COUNT(*) AS count FROM ${name}`);
    count = parseInt(count);
    return { columns, rows, count };
  } catch (err) {
    return Promise.reject(new Error(err));
  }
};

const query  = async (sql, params = []) => {
  if (!db) {
    const a = await credentials.get();
    db = pgp(a.url);
  }
  return db.any(sql, params);
};

module.exports = {
  tables,
  table,
  query,
};
