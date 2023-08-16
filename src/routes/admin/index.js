'use strict';
const express = require('express');
const login = require('./login');
const dashboard = require('./dashboard');
const authenticate = require('./authenticate');

const router = express.Router();

router.use('/', login);
router.use('/authenticate', authenticate);
router.use('/dashboard', dashboard);

module.exports = router;