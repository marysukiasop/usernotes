const { Pool } = require('pg');

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "user1",
  password: "mypass",
  database: "user1sdb",
});


module.exports = pool;
