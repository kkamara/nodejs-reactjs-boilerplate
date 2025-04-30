'use strict';
const express = require('express');
const { status, } = require("http-status");
const config = require('../../config');
const db = require('../../models/index');
const { message400, message500, } = require('../../utils/httpResponses');

const login = express.Router();

login.get('/', async (req, res) => {
  const title = 'Admin Login';  
  const session = { page: null, auth: null, };
  
  return res.render('admin/auth/login', {
      config,
      title,
      session,
  });
});

login.post('/', async (req, res) => {
  const title = 'Admin Login Action';
  
  const email = req.bodyString('email');
  const password = req.bodyString('password');
  
  const validInput = db.sequelize.models
    .User
    .validateAuthenticate(email, password);  
  if (validInput instanceof Array) {
    res.status(status.BAD_REQUEST);
    return res.json({ 
      message: message400,
      errors: validInput,
    });
  }
  
  try {
    const auth = await db.sequelize.models
      .User
      .authenticate(email, password);
    if (config.nodeEnv !== 'production') {
      console.log('auth :',auth)
    }
    if (auth === false) {
      res.status(status.BAD_REQUEST);
      return res.json({ 
        message: 'Invalid user and password combination.',
      });
    }
  } catch(err) {
    res.status(status.BAD_REQUEST);
    return res.json({ 
      message: 'Invalid user and password combination.',
    });
  }
  try {
    auth.token = await db.sequelize.models
      .User
      .getNewToken(
        auth.uid,
      );
  } catch(err) {
    res.status(status.INTERNAL_SERVER_ERROR);
    return res.json({ 
      message: message500,
    });
  }

  const session = { auth, };
  
  res.status(status.OK);
  return res.json({ 
    routeName: title,
    data: session, 
  });
});

module.exports = login;