'use strict';
const express = require('express');
const users = require("./users");
const user = require("./user");

const router = express.Router();

router.use("/users", users);
router.use("/user", user);

module.exports = router;