"use strict";
const session = require('express-session');
const FileStore = require('session-file-store');
const path = require('node:path');
const config = require('../../config');

module.exports.session = session({
  store: "production" === config.nodeEnv ? 
    new (FileStore(session))({
      path: path.join(
        __dirname,
        "..",
        "..",
        "..",
        "sessions",
      ),
    }) : undefined,
  secret: config.appKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: "production" === config.nodeEnv,
  },
});