const router = require("express").Router();
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("isomorphic-fetch");

const app = express();

app.use(bodyParser.json());

router.post("/send", async (req, res) => {
  const secret_key = process.env.REACT_APP_SECRET_KEY;
  const token = req.body.token;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => res.json({ google_response }))
    .catch((error) => res.json({ error }));
  console.log(res);
});

module.exports = router;
