'use strict';
const express = require('express');
const { status, } = require("http-status");
const config = require('../../config');
const db = require('../../models/index');
const {
  message400,
  message500,
  message200,
} = require('../../utils/httpResponses');

const dashboard = express.Router();

dashboard.get('/', async (req, res) => {
  const title = 'Admin Dashboard';
  
  const session = { auth: null, };
  
  return res.render(
    'admin/dashboard',
    {
      config,
      title,
      session,
    }
  );
});

dashboard.post('/', async (req, res) => {
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
    .User
    .getUserByToken(token);
  if (auth === false) {
    res.status(status.UNAUTHORIZED);
    return res.json({ 
      message: message400,
      error: 'Error encountered when getting user details with authorized token.',
    });
  }
  auth.token = token;

  const stats = await db.sequelize.models
    .User
    .getStats(
      auth.id,
    );
  if (stats === false) {
    res.status(status.INTERNAL_SERVER_ERROR);
    return res.json({ 
      message: message500,
      error: 'Encountered error when retrieving your stat data.',
    });
  }
  
  return res.json({ 
    message: message200,
    data: stats,
  });
});

module.exports = dashboard;