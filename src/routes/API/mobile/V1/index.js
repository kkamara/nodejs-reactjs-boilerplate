"use strict";
const express = require("express");
const mobileRoutes = require("./mobileRoutes");

const router = express.Router();

router.use("/", mobileRoutes);

module.exports = router;