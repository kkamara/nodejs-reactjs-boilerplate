'use strict';
const express = require('express');
const { status, } = require("http-status");
const { message200, } = require('../../../utils/httpResponses');
const asyncHandler = require("express-async-handler");

const health = express.Router();

health.get('/', asyncHandler((req, res) => {
  res.status(status.OK);
  return res.json({
    message: message200,
  });
}));

module.exports = health;