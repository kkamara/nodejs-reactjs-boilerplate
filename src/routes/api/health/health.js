'use strict';
const express = require('express');

const health = express.Router();

health.get('/', (req, res) => {  
  res.status(200);
  return res.json({
    message: "Success",
  });
});

module.exports = health;