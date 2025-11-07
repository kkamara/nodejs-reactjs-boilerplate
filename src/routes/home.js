'use strict';
const express = require('express');
const config = require("../config");
const asyncHandler = require("express-async-handler");

const home = express.Router();

home.get('/', asyncHandler(async (req, res) => {
  return res.render('home', {
    title: "Home",
    flashSuccess: "Some success.",
    flashError: "Some error.",
    config: {
      appName: config.appName,
    },
  });
}));

module.exports = home;