'use strict';
const express = require('express');
const { status, } = require("http-status");
const db = require('../../models/v1/index');
const { message400, message200, } = require('../../utils/httpResponses');

const authenticate = express.Router();

authenticate.post('/', async (req, res) => {
  if (
    !req.headerString("authorization") || 
    null === req.headerString("authorization").match(/Basic /)
  ) {
    res.status(status.UNAUTHORIZED);
    return res.json({ message: message400, });
  }

  const token = req.headerString("authorization")
    .replace('Basic ', '');
  const auth = await db.sequelize.models
    .user
    .getUserByToken(token);
  if (auth === false) {
    res.status(status.UNAUTHORIZED);
    return res.json({ message: message400, });
  }
  auth.token = token;
  const session = { auth, };
  
  return res.json({ 
    message: message200,
    data: session,
  });
});

module.exports = authenticate;