"use strict";
const asyncHandler = require("express-async-handler");

const hello = asyncHandler(async (req, res) => {
  return res.json({
    message: "Hello from the NodeJS server.",
  });
});

module.exports = { hello, };