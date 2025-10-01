'use strict';
const express = require('express');
const config = require("../config");

const home = express.Router();

home.get('/', async (req, res) => {
  return res.render('home', {
    title: "Home",
    flashSuccess: "Some success.",
    flashError: "Some error.",
    config: {
      appName: config.appName,
    },
  });
})

module.exports = home;