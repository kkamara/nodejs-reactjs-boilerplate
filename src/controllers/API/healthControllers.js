'use strict';
const { status, } = require("http-status");
const { message200, } = require('../../utils/httpResponses');
const asyncHandler = require("express-async-handler");

const health = asyncHandler(async (req, res) => {
  res.status(status.OK);
  return res.json({
    message: message200,
  });
});

module.exports = { health };