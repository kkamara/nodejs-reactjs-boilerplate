'use strict';
const express = require('express');
const { getUsers } = require('../../../../controllers/API/V1/web/usersControllers');

const router = express.Router();

router.route("/").get(getUsers);

module.exports = router;