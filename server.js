require("dotenv").config();
const express = require("express");
const app = require("./src/app");
const connectDb = require("./src/config/db");

connectDb();

app.listen(process.env.PORT, () => {
  console.log("server started");
});
