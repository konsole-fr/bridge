#!/usr/bin/env node

const fs = require('fs');
const express = require('express');
const postgres = require('./lib/postgres');

if (process.env.NODE_ENV !== 'test' && !fs.existsSync('.credentials.json')) {
  console.log(`You haven't setup the bridge yet. Run the following command to do so: konsole-config`);
  process.exit(0);
}

const app = express();
app.use(express.json());

const findPrimaryKey = async (table) => {
  const { columns } = await postgres.table(table);
  const primaryKey = columns.find(x => x.primaryKey).name;
  return primaryKey;
};

app.get('/api/tables', async (req, res) => {
  const tables = await postgres.tables();
  res.json(tables);
});

app.get('/api/tables/:name', async (req, res, next) => {
  try {
    const table = await postgres.table(req.params.name);
    res.json(table);
  } catch (err) {
    if (err.message.match(/does not exist/)) {
      return res.sendStatus(404);
    }
    next(err);
  }
});

app.post('/api/tables/:name/records', async (req, res, next) => {
  try {
    const primaryKey = await findPrimaryKey(req.params.name);
    const queryParts = [`INSERT INTO ${req.params.name} (`];
    Object.keys(req.body).forEach((key, index) => {
      if (index == 0) {
        queryParts.push(`${key}`);
      } else {
        queryParts.push(`,${key}`);
      }
    });
    queryParts.push(`) VALUES (`);
    Object.values(req.body).forEach((key, index) => {
      if (index == 0) {
        queryParts.push(`$${index+1}`);
      } else {
        queryParts.push(`,$${index+1}`);
      }
    });
    queryParts.push(`) RETURNING ${primaryKey}`);
    const query = queryParts.join(' ');

    const [data] =  await postgres.query(query, Object.values(req.body));
    res.status(201).json(data);
  } catch (err) {
    if (err.message.match(/does not exist/)) {
      return res.sendStatus(404);
    }
    next(err);
  }
});

app.get('/api/tables/:name/records/:id', async (req, res, next) => {
  try {
    const primaryKey = await findPrimaryKey(req.params.name);
    const data = await postgres.query(`SELECT * FROM ${req.params.name} WHERE ${primaryKey} = $1`, [req.params.id]);
    if (data.length == 0) return res.sendStatus(404); 
    res.json(data[0]);
  } catch (err) {
    if (err.message.match(/does not exist/)) {
      return res.sendStatus(404);
    }
    next(err);
  }
});

app.post('/api/tables/:name/records/:id', async (req, res, next) => {
  try {
    const primaryKey = await findPrimaryKey(req.params.name);
    const data = await postgres.query(`SELECT * FROM ${req.params.name} WHERE ${primaryKey} = $1`, [req.params.id]);
    if (data.length == 0) return res.sendStatus(404); 

    const queryParts = [`UPDATE ${req.params.name} SET`];
    Object.entries(req.body).forEach(([key, value], index) => {
      if (index == 0) {
        queryParts.push(`${key} = $${index+1}`);
      } else {
        queryParts.push(`, ${key} = $${index+1}`);
      }
    });
    const lastIndex = Object.keys(req.body).length + 1;
    queryParts.push(`WHERE ${primaryKey} = $${lastIndex}`);
    const query = queryParts.join(' ');

    const params = [...Object.values(req.body), req.params.id];
    await postgres.query(query, params);
    const data2 = await postgres.query(`SELECT * FROM ${req.params.name} WHERE ${primaryKey} = $1`, [req.params.id]);
    res.json(data2[0]);
  } catch (err) {
    if (err.message.match(/does not exist/)) {
      return res.sendStatus(404);
    }
    next(err);
  }
});

app.delete('/api/tables/:name/records/:id', async (req, res, next) => {
  try {
    const primaryKey = await findPrimaryKey(req.params.name);
    const data = await postgres.query(`SELECT * FROM ${req.params.name} WHERE ${primaryKey} = $1`, [req.params.id]);
    if (data.length == 0) return res.sendStatus(404); 

    await postgres.query(`DELETE FROM ${req.params.name} WHERE ${primaryKey} = $1`, [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    if (err.message.match(/does not exist/)) {
      return res.sendStatus(404);
    }
    next(err);
  }
});

app.post('/api/queries', async (req, res, next) => {
  try {
    if (!req.body.sql) return res.sendStatus(400);
    const data = await postgres.query(req.body.sql);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV != 'test') console.log(err);
  res.status(500).send(err);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3001, () => {
    console.log('Konsole bridge running on port', 3001);
  });
}
module.exports = app;
