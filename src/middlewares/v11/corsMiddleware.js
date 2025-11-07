"use strict";
const config = require('../../config');

module.exports.cors = (req, res, next) => {
  const allowedOrigins = config.allowedOrigins.split(",");
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, x-id, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
};