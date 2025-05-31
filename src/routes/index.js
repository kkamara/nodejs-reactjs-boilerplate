'use strict';
const express = require('express');
const home = require('./home');
const api = require('./api');
const v1 = require('./api/v1');
const mobileV1 = require('./api/mobile/v1');

const router = express.Router();

router.use('/api', api);
router.use('/api/v1', v1);
router.use('/mobile-api/v1', mobileV1);
router.use('/home', home);

module.exports = router;