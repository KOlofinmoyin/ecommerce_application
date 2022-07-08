const express = require("express");
const bodyParser = require("body-parser");
const { request } = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.send("Welcome to the e-commerce REST (API)");
});

app.listen(port, () => {
  console.log(`Amazoon ecommerce App. listening on ${port}.`);
});
