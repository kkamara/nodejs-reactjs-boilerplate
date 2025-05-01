'use strict';
const express = require('express');
const { status, } = require("http-status");
const db = require('../../../../models/index');
const { message400, message500, } = require('../../../../utils/httpResponses');

const login = express.Router();

login.get('/', async (req, res) => {
  const title = 'Login';
  const session = {};
  session.page = { 
    loginEmails: [
      'admin@mail.com',
      'clientadmin@mail.com',
      'clientuser@mail.com',
    ],
  };
  session.auth = null;
  
  res.status(status.OK);
  return res.json({
      data: {
        routeName: title,
        user: session,
      },
  });
})

login.post('/', async (req, res) => {
  const title = 'Login Action';
  let session = {};
  session.page = { 
    loginEmails: [
      'admin@mail.com',
      'clientadmin@mail.com',
      'clientuser@mail.com',
    ],
  };
  session.auth = null;

  const validInput = db.sequelize.models.User.validateAuthenticate(
    req.bodyString('email'),
    req.bodyString('password'),
  );
  if (true !== validInput) {
    res.status(status.BAD_REQUEST);    
    return res.json({
      message: message400,
      error: validInput[0],
    });
  }

  session.auth = await db.sequelize.models
    .User
    .authenticate(
      req.bodyString('email'),
      req.bodyString('password'),
    );  
  if (false === session.auth) {
    res.status(status.BAD_REQUEST);
    return res.json({
      message: message400,
      error: 'Unable to authenticate user due to invalid combination.',
    });
  }
  
  session.auth.token = await db.sequelize.models
    .User
    .getNewToken(
      session.auth.id,
    );  
  if (false === session.auth.token) {
    res.status(status.INTERNAL_SERVER_ERROR);
    return res.json({
      message: message500,
      error: 'Encountered unexpected error when creating a new token.',
    });
  }

  return res.json({
    data: {
      routeName: title,
      data: session,
    },
  });
});

module.exports = login;