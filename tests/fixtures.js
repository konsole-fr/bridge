const postgres = require('../lib/postgres');

const clean = async () => {
  const a = postgres.query('DELETE FROM bikes');
  const b = postgres.query('DELETE FROM users');
  return Promise.all([a, b]);
};

const insert = async () => {
  const [a] = await postgres.query("INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING id", [1, 'admin@gmail.com', 'password']);
  const b = await postgres.query("INSERT INTO users (id, email, password) VALUES ($1, $2, $3)", [2, 'sayid.mimouni@gmail.com', 'said']);
  const c = await postgres.query("INSERT INTO users (id, email, password) VALUES ($1, $2, $3)", [3, 'sayid.mimouni@gmail.com2', 'said']);
  return postgres.query("INSERT INTO bikes (bike_id, name, user_id) VALUES ($1, $2, $3)", [1, 'ab', a.id]);
};

module.exports = {
  clean,
  insert,
};
