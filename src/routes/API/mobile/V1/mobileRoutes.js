"use strict";
const express = require("express");
const { hello } = require("../../../../controllers/API/mobile/V1/mobileControllers");

const router = express.Router();

router.route("/hello").get(hello);

module.exports = router;