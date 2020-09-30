const fs = require('fs');
const path = require('path');
const pgp = require('pg-promise')({});

const rootDir = path.dirname(require.main.filename);

let databaseURL;
if (process.env.NODE_ENV == 'test') {
  databaseURL = 'postgres://saidmimouni:@localhost/konsole_test';
} else {
  if (fs.existsSync(rootDir + '/.credentials.json')) {
    let credentials = fs.readFileSync(rootDir + '/.credentials.json');
    credentials = JSON.parse(credentials.toString());
    databaseURL = credentials.url;
  } else {
    databaseURL = 'postgres://saidmimouni:@localhost/iqraa';
  }
}

const db = pgp(databaseURL);

const tables = async () => {
  const data = await db.any("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  return data.map(x => x.table_name);
};

const table = async (name) => {
  try {
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

    const relationships = columns.filter(x => x.references);
    const foreignTables = relationships.map(x => {
      const [table, column] = x.references.split('#');
      return { table, column };
    });

    const rows = await db.any(`SELECT * FROM ${name} LIMIT 50`);
    return { columns, rows };
  } catch (err) {
    return Promise.reject(new Error(err));
  }
};

const query  = async (sql, params = []) => {
  return db.any(sql, params);
};

module.exports = {
  tables,
  table,
  query,
};
