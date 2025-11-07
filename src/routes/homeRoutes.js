'use strict';
const express = require('express');
const { home } = require('../controllers/homeControllers');

const router = express.Router();

router.route("/home").get(home);

module.exports = router;