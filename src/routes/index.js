'use strict';
const express = require('express');
const homeRoutes = require('./homeRoutes');
const api = require('./api');
const v1 = require('./api/V1');
const mobileV1 = require('./api/mobile/V1');

const router = express.Router();

router.use('/api', api);
router.use('/api/v1', v1);
router.use('/mobile-api/v1', mobileV1);
router.use('/', homeRoutes);

module.exports = router;