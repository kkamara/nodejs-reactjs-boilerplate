'use strict';
const express = require('express');
const deepClone = require('deep-clone');
const { status, } = require("http-status");
const db = require('../../../../models/index');

const authenticate = express.Router();

authenticate.post('/', async (req, res) => {
  if (
    !req.headerString("authorization") || 
    null === req.headerString("authorization").match(/Basic /)
  ) {
    res.status(status.UNAUTHORIZED);
    return res.json({ message: 'Unauthorized.' });
  }

  const token = req.headerString("authorization")
    .replace('Basic ', '');
  req.session.auth = await db.sequelize.models
    .User
    .getUserByToken(token);
  req.session.auth.token = token;
  if (req.session.auth === false) {
    res.status(status.UNAUTHORIZED);
    return res.json({ message: 'Unauthorized.' });
  }

  req.session.page = { title: 'Admin Authenticate', };
  
  await new Promise((resolve, reject) => {
    req.session.save(function(err) {
      if (err) {
        console.log(err)
        return reject(err);
      }
      resolve()
    });
  });
  
  const newSession = { page: req.session.page, auth: req.session.auth, };
  newSession.auth.token = token;
  const session = deepClone(newSession);
  await new Promise((resolve, reject) => {
    req.session.destroy(function(err) {
      if (err) {
        console.log(err)
        return reject(err);
      }
      resolve();
    });
  });
  
  return res.json({ 
    message: 'Success',
    data: session,
  });
});

module.exports = authenticate;