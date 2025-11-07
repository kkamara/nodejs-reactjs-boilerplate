"use strict";
const { status, } = require("http-status");
const moment = require("moment-timezone");
const { message401, } = require("../../utils/httpResponses");
const db = require("../../models/V1/index");

module.exports.authenticate = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(status.UNAUTHORIZED);
    return res.json({
      message: message401,
    });
  }
  const authTokenResult = await db.sequelize
    .models
    .userToken
    .authenticate(
      req.headerString("authorization"),
    );
  if (false === authTokenResult) {
    res.status(status.UNAUTHORIZED);
    return res.json({
      message: message401,
    });
  }
  const tokenIsExpired = moment(authTokenResult.expiredAt)
    .unix() < moment().utc().unix();
  if (true === tokenIsExpired) {
    res.status(status.UNAUTHORIZED);
    return res.json({
      message: message401,
    });
  }
  const extractedToken = req.headerString("authorization")
    .split(" ")[1];
  req.session.userId = authTokenResult.userId;
  req.session.extractedToken = extractedToken;
  return next();
};