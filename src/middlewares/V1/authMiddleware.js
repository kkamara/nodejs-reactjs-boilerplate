"use strict";
const { status, } = require("http-status");
const moment = require("moment-timezone");
const { message401, } = require("../../utils/httpResponses");
const db = require("../../models/V1/index");
const asyncHandler = require("express-async-handler");

module.exports.authenticate = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(status.UNAUTHORIZED);
    throw new Error(message401);
  }
  const authTokenResult = await db.sequelize
    .models
    .userToken
    .authenticate(
      req.headerString("authorization"),
    );
  if (false === authTokenResult) {
    res.status(status.UNAUTHORIZED);
    throw new Error(message401);
  }
  const extractedToken = req.headerString("authorization")
    .split(" ")[1];
  req.session.userID = authTokenResult.userID;
  req.session.extractedToken = extractedToken;
  return next();
});