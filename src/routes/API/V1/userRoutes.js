"use strict";
const express = require("express");
const { authenticate, } = require("../../../middlewares/V1/authMiddleware");
const { createUser, loginUser, authoriseUser, logoutUser } = require("../../../controllers/API/V1/userControllers");

const router = express.Router();

router.route("/register").post(createUser);
router.route("/").post(loginUser).delete(authenticate, logoutUser);
router.route("/authorise").get(authenticate, authoriseUser);

module.exports = router;