'use strict';
const express = require('express');
const webRoutes = require("./web");
const userRoutes = require("./user");

const router = express.Router();

router.use("/web", webRoutes);
router.use("/user", userRoutes);

module.exports = router;