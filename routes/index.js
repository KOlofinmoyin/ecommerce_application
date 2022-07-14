const express = require("express");
const bodyParser = require("body-parser");
const { request } = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("../db/index");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
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

// Add your passport local strategy below:
passport.use(
  new LocalStrategy(function (username, password, done) {
    db.findByUsername(username, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password != password) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);
app.post("/login", (req, res) => {
  if (password == "codec@demy10") {
    // Attach an `authenticated` property to our session:
    req.session.authenticated = true;
    // Attach a user object to our session:
    req.session.user = {
      username,
      password,
    };
  } else {
    res.send("Who dares disturb my slumber? ;<");
  }
});

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
