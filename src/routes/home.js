'use strict';
const express = require('express');
const config = require("../config");

const home = express.Router();

home.get('/', async (req, res) => {
  return res.render('home', {
      title: "Home",
      appName: config.appName,
      flashSuccess: "Some success.",
      flashError: "Some error.",
  });
})

module.exports = home;