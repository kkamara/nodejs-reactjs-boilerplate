"use strict";
const { fileSize, } = require("./file");

exports.defaultConfig = {
  dest: "./uploads",
  limits: {
    fileSize, 
  },
};