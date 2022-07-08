const Pool = require("pg").Pool;
const pool = new Pool({
  user: "db_admin",
  host: "localhost",
  database: "ecommerce_api",
  password: "pa55w0rd",
  port: 5432,
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM accounts ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  getUsers,
};
