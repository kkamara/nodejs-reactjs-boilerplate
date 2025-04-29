'use strict';
const express = require('express');
const { status, } = require("http-status");

const health = express.Router();

health.get('/', (req, res) => {
  res.status(status.OK);
  return res.json({
    message: "Success",
  });
});

module.exports = health;