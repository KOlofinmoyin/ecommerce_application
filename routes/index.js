const express = require("express");
const bodyParser = require("body-parser");
// const { request, response } = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("../db/index");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const store = new session.MemoryStore();

// Logging Middleware
app.use(morgan("tiny"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//Session middleware created below:
app.use(
  session({
    // secret: process.env.kalubi,
    secret: "Lor3mIp5um",
    cookie: { maxAge: 172800000, secure: true, sameSite: "none" },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// Create passport middleware
app.use(passport.initialize());

app.use(passport.session());

// Complete the serializeUser function below:
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Complete the deserializeUser function below:
passport.deserializeUser((id, done) => {
  db.findById("SELECT * FROM accounts WHERE id = $1", [id], (err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});

// Passport local strategy:
passport.use(
  new LocalStrategy(function (email, password, cb) {
    db.findByUserEmail(
      "SELECT * FROM accounts WHERE email = $1",
      [email],
      (err, user) => {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }
        if (user.password != password) {
          return cb(null, false);
        }
        return cb(null, user);
      }
    );
  })
);

// Helper function used in 2ND - SECOND incarnation of login authentication - DOESN'T WORK:
function ensureAuthentication(req, res, next) {
  // Complete the if statmenet below:
  if (req.session.authenticated) {
    return next();
  } else {
    res.status(403).json({ msg: "You're not authorized to view this page" });
  }
}

// 1ST - FIRST incarnation of login authentication:
// app.post("/login", db.findByUserEmail);

// 2ND - SECOND incarnation of login authentication:
// app.post("/login", (req, res) => {
//   const { email, password } = req.body.user;
//   if (password == "codec@demy10") {
//     // Attach an `authenticated` property to our session:
//     req.session.authenticated = true;
//     // Attach a user object to our session:
//     req.session.user = {
//       email,
//       password,
//     };
//     res.redirect("/");
//   } else {
//     res.send("Who dares disturb my slumber? ;<");
//   }
// });

app.get("/login", (req, res) => {
  res.send("Login page");
});

// 3RD - THIRD incarnation of login authentication:
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Redirect route used in 2ND - SECOND incarnation of login authentication - DOESN'T WORK:
// app.get("/", ensureAuthentication, (request, response) => {}
app.get("/", (req, res) => {
  res.send("Welcome to the e-commerce REST (API)");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// ACCOUNTS/USERS enndpoints:

app.get("/accounts", db.getUsers);

app.get("/accounts/:id", db.getUserById);

app.post("/register", db.createUser);

app.put("/accounts/:id", db.updateUser);

app.delete("/accounts/:id", db.deleteUser);

// PRODUCTS endpoints
app.get("/products/find", db.getProductByCategoryQuery);

app.get("/products", db.getProducts);

app.get("/products/:id", db.getProductById);

// CARTS endpoints:
app.post("/cart", db.createCart);

app.get("/cart/:id", db.getCartById);

// Start app. listening on PORT
app.listen(port, () => {
  console.log(`Amazoon ecommerce App. listening on ${port}.`);
});
