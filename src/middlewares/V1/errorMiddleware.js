"use strict";
const { nodeEnv } = require('../../config');
const { status, } = require('http-status');

module.exports.notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(status.NOT_FOUND);
  next(error);
};

module.exports.jsonError = (err, req, res, next) => {
  if ("production" !== nodeEnv) {
    console.log(err);
  }
  return res.status(res.statusCode || status.INTERNAL_SERVER_ERROR)
    .send({
      message: err.message,
      stack: "production" === nodeEnv ? null : err.stack,
    });
};