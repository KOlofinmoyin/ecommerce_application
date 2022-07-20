const Pool = require("pg").Pool;
const pool = new Pool({
  user: "db_admin",
  host: "localhost",
  database: "ecommerce_api",
  password: "pa55w0rd",
  port: 5432,
});

// ACCOUNTS db operations:
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

// TO-DO: Task INCOMPLETE
// const findByUserEmail = (email, cb) => {

//   pool.query(
//     "SELECT password FROM accounts WHERE email = $1",
//     [email],
//     (error, user) => {
//         if (error) { return cb(error); }
//         if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
//     }

//   );
// };

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM accounts WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

// PRODUCTS db operations:
const getProducts = (request, response) => {
  pool.query("SELECT * FROM products ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getProductById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM products WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getProductByCategoryQuery = (request, response) => {
  const query = request.query.category_id;
  pool.query(
    "SELECT * FROM products WHERE category_id = $1",
    [query],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(query);
      response.status(200).json(results.rows);
    }
  );
};

// CARTs db operations:
const createCart = (request, response) => {
  const { discount, fulfilled, bill_date } = request.body;

  pool.query(
    "INSERT INTO carts (discount,fulfilled,bill_date) VALUES ($1, $2, $3) RETURNING *",
    [discount, fulfilled, bill_date],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Cart added with ID: ${results.rows[0].id}`);
    }
  );
};

const getCartById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM carts WHERE id = $1", [id], (error, results) => {
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
  deleteUser,
  getProducts,
  getProductById,
  getProductByCategoryQuery,
  createCart,
  getCartById,
  findByUserEmail: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  findById: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
