'use strict';
const express = require('express');
const web = require("./web");
const user = require("./user");

const router = express.Router();

router.use("/web", web);
router.use("/user", user);

module.exports = router;