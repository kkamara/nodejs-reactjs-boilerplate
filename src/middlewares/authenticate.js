"use strict";
const { status, } = require("http-status");
const { message401, } = require("../../utils/httpResponses");

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(status.UNAUTHORIZED);
    return res.json({
      message: message401,
    });
  }
  if (false) {
    res.status(status.UNAUTHORIZED);
    return res.json({
      message: message401,
    });
  }
  req.session.userId = 1;
  return next();
};