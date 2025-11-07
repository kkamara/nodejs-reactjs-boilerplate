"use strict";
const express = require("express");
const user = require("./userRoutes");

const router = express.Router();

router.use("/", user);

module.exports = router;