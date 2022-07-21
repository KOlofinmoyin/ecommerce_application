const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const db = require("../db/index");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const store = new session.MemoryStore();

//Middleware
app.use(morgan("tiny")); // Logging
app.use(bodyParser.json()); //parsing so content of request body can be accesessed from routes
app.use(bodyParser.urlencoded({ extended: true })); //middleware for parsing bodies from URL
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Session middleware created below:
app.use(
  session({
    secret: "Lor3mIp5um",
    cookie: { maxAge: 172800000, secure: true, sameSite: "none" },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//SerializeUser function:
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// DeserializeUser function:
passport.deserializeUser((id, done) => {
  db.findById("SELECT * FROM accounts WHERE id = $1", [id], (err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});

// Passport local strategy:
passport.use(
  new LocalStrategy(function (username, password, cb) {
    db.findByUserEmail(
      "SELECT * FROM accounts WHERE email = $1",
      [username],
      (err, result) => {
        if (err) {
          return cb(err);
        }
        if (!result && result.rows.length != 1) {
          return cb(null, false);
        }
        const user = result.rows[0];

        if (user.password != password) {
          return cb(null, false);
        }

        return cb(null, user);
      }
    );
  })
);

// ACCOUNTS/USERS endpoints:
app.get("/", (req, res) => {
  res.send(`Welcome to the e-commerce REST API.`);
});

app.get("/login", (req, res) => {
  res.send("Login page");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/accounts", db.getUsers);

app.get("/accounts/:id", db.getUserById);

app.post("/register", db.createUser);

app.put("/accounts/:id", db.updateUser);

app.delete("/accounts/:id", db.deleteUser);

// ORDERS endpoints
app.get("/orders", db.getOrders);

app.get("/orders/:id", db.getOrderById);

// PRODUCTS endpoints
app.get("/orders/find", db.getProductByCategoryQuery);

app.get("/products", db.getProducts);

app.get("/products/:id", db.getProductById);

// CARTS endpoints:
app.post("/cart", db.createCart);

app.get("/cart/:id", db.getCartById);

// Start app. listening on PORT
app.listen(port, () => {
  console.log(`Amazoon ecommerce App. listening on ${port}.`);
});
