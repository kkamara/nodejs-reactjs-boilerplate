'use strict';
const express = require('express');
const deepClone = require('deep-clone');
const { status, } = require("http-status");
const config = require('../../config');
const db = require('../../models/index');

const login = express.Router();

login.get('/', async (req, res) => {
  req.session.page = { title: 'Admin Login', };
  req.session.auth = null;

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
  
  return res.render('admin/auth/login', {
      config,
      title: session.page.title,
      session,
  });
});

login.post('/', async (req, res) => {
  req.session.page = { title: 'Admin Login Action', };
  req.session.auth = null;

  await new Promise((resolve, reject) => {
    req.session.save(function(err) {
      if (err) {
        console.log(err)
        return reject(err);
      }
      resolve()
    });
  });
  
  const email = req.bodyString('email');
  const password = req.bodyString('password');
  
  const validInput = db.sequelize.models
    .User
    .validateAuthenticate(email, password);  
  if (validInput instanceof Array) {
    res.status(status.BAD_REQUEST);
    return res.json({ 
      message: 'Bad request.',
      errors: validInput,
    });
  }
  
  try {
    req.session.auth = await db.sequelize.models
      .User
      .authenticate(email, password);
    if (config.nodeEnv !== 'production') {
      console.log('req.session.auth :',req.session.auth)
    }
    if (req.session.auth === false) {
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
    req.session.auth.token = await db.sequelize.models
      .User
      .getNewToken(
        req.session.auth.uid,
      );
  } catch(err) {
    res.status(status.INTERNAL_SERVER_ERROR);
    return res.json({ 
      message: 'Please try again and contact administrator.',
    });
  }

  const newSession = { page: req.session.page, auth: req.session.auth, };
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
  
  res.status(status.OK);
  return res.json({ 
    routeName: session.page.title,
    data: session, 
  });
});

module.exports = login;