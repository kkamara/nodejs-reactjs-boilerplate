'use strict';
const express = require('express');
const { status, } = require("http-status");
const db = require('../../../../models/v1/index');
const { message200, } = require('../../../../utils/httpResponses');

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
    .user
    .getUserByToken(token);
  if (false === auth) {
    res.status(status.UNAUTHORIZED);
    return res.json({ message: 'Unauthorized.' });
  }
  auth.token = token;
  
  return res.json({ 
    message: message200,
    data: session,
  });
});

module.exports = authenticate;