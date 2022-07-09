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

<<<<<<< HEAD
const updateUser = (request, response) => {
=======
const updateAccount = (request, response) => {
>>>>>>> bd29c82604fa62ed184ddf96477ea95243f7f5c5
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

<<<<<<< HEAD
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM accounts WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  getUserById,
=======
module.exports = {
  getUsers,
  createUser,
  updateAccount,
>>>>>>> bd29c82604fa62ed184ddf96477ea95243f7f5c5
};
