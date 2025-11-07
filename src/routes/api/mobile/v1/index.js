"use strict";
const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();

router.get("/hello", asyncHandler((req, res) => res.json({
  message: "Hello from the NodeJS server.",
})));

module.exports = router;