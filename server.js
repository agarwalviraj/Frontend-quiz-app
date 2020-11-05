const express = require("express");
const app = express();
const https = require("https");
const path = require("path");
const bodyParser = require("body-parser");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.listen(3000, () => {
  console.log("Hello");
});
