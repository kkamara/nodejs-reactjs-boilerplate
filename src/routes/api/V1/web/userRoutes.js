"use strict";
const express = require("express");
const { authenticate, } = require("../../../../middlewares/V1/authMiddleware");
const { createUser, loginUser, authoriseUser, logoutUser, uploadAvatar, updateUser, removeAvatar } = require("../../../../controllers/API/V1/web/userControllers");

const router = express.Router();

router.route("/register").post(createUser);
router.route("/").post(loginUser)
  .delete(authenticate, logoutUser)
  .patch(authenticate, updateUser);
router.route("/authorise").get(authenticate, authoriseUser);
router.route("/avatar")
  .post(authenticate, uploadAvatar)
  .delete(authenticate, removeAvatar);

module.exports = router;