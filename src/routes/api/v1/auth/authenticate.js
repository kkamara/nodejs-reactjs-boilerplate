'use strict';
const express = require('express');
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
  const auth = await db.sequelize.models
    .User
    .getUserByToken(token);
  if (false === auth) {
    res.status(status.UNAUTHORIZED);
    return res.json({ message: 'Unauthorized.' });
  }
  auth.token = token;
  
  return res.json({ 
    message: 'Success',
    data: session,
  });
});

module.exports = authenticate;