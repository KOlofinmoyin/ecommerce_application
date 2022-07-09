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

const createUser = (request, response) => {
  const { first_name, last_name, phone, email, address, password } =
    request.body;

  pool.query(
    "INSERT INTO accounts (first_name,last_name,phone,email,address,password ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [first_name, last_name, phone, email, address, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(201)
        .send(`User-account added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { first_name, last_name, phone, email, address, password } =
    request.body;

  pool.query(
    "UPDATE accounts SET first_name = $1, last_name = $2, phone = $3, email = $4, address = $5, password = $6 WHERE id = $7",
    [first_name, last_name, phone, email, address, password, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User-account modified with ID: ${id}`);
    }
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM accounts WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM accounts WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
};
