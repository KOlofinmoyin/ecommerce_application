const express = require("express");
const bodyParser = require("body-parser");
const { request } = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("../db/index");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");
const store = new session.MemoryStore();

// Logging Middleware
app.use(morgan("tiny"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Create passport middleware
app.use(passport.initialize());

app.use(passport.session());

// Create session middleware below:
app.use(
  session({
    secret: process.env.kalubi,
    cookie: { maxAge: 172800000, secure: true, sameSite: "none" },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

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
app.get("/products?category_id", db.getProductByCategoryQuery);

app.get("/products", db.getProducts);

app.get("/products/:id", db.getProductById);

// CARTS endpoints:
app.post("/cart", db.createCart);

app.get("/cart/:id", db.getCartById);

// Start app. listening on PORT
app.listen(port, () => {
  console.log(`Amazoon ecommerce App. listening on ${port}.`);
});
