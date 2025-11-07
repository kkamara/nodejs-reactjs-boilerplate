'use strict';
const express = require('express');
const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./API');
const v1Routes = require('./API/V1');
const mobileV1Routes = require('./API/mobile/V1');

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/api/v1', v1Routes);
router.use('/mobile-api/v1', mobileV1Routes);
router.use('/', homeRoutes);

module.exports = router;