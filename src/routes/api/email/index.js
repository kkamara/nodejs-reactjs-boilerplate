'use strict';
const express = require('express');
const email = require('./email');

const router = express.Router();

router.use('/', email);

module.exports = router;