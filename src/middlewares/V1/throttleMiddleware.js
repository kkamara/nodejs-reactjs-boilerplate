"use strict";
const { rateLimit, } = require("express-rate-limit");
const config = require('../../config');

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Every 15 minutes
  limit: "production" === config.nodeEnv ? 10000 : 100000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
});