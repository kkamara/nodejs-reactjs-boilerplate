'use strict';
const express = require('express');
const webRoutes = require("./web");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/web", webRoutes);
router.use("/user", userRoutes);

module.exports = router;