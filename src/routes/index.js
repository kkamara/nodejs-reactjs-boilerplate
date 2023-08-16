const express = require('express');
const home = require('./home');
const api = require('./api');
const admin = require('./admin');

const router = express.Router();

router.use('/api/v1', api);
router.use('/', home);
router.use('/admin', admin);

module.exports = router;