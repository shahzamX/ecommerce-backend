const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5431, 
  user: "postgres",
  password: "mysecretpassword",
  database: "ecommerce"
});

module.exports = pool;