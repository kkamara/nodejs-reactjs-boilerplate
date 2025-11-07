'use strict';
const express = require('express');
const usersRoutes = require("./usersRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/user", userRoutes);

module.exports = router;