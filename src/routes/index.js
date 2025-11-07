'use strict';
const express = require('express');
const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./api');
const v1Routes = require('./api/V1');
const mobileV1Routes = require('./api/mobile/V1');

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/api/v1', v1Routes);
router.use('/mobile-api/v1', mobileV1Routes);
router.use('/', homeRoutes);

module.exports = router;