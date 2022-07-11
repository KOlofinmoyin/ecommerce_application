const express = require("express");
const bodyParser = require("body-parser");
const { request } = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("../db/index");

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.send("Welcome to the e-commerce REST (API)");
});

// ACCOUNTS/USERS enndpoints:

app.get("/accounts", db.getUsers);

app.get("/accounts/:id", db.getUserById);

app.post("/register", db.createUser);

app.put("/accounts/:id", db.updateUser);

app.delete("/accounts/:id", db.deleteUser);

// PRODUCTS endpoints
app.get("/products", db.getProducts);

app.get("/products?category={categoryId}", db.getProductByCategoryQuery);

app.get("/products/:id", db.getProductById);

// CARTS endpoints:
app.post("/cart", db.createCart);

app.get("/cart/:id", db.getCartById);

// Start app. listening on PORT
app.listen(port, () => {
  console.log(`Amazoon ecommerce App. listening on ${port}.`);
});
