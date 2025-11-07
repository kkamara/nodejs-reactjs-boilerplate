"use strict";
const asyncHandler = require("express-async-handler");

const hello = asyncHandler((req, res) => res.json({
  message: "Hello from the NodeJS server.",
}));

module.exports = { hello, };