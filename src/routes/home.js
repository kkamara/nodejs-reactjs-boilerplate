'use strict';
const express = require('express');
const { QueryTypes, } = require('sequelize');
const config = require('../config');
const db = require('../models/v1');

const home = express.Router();

home.get('/dashboard', async (req, res) => {
  const adminUser = 'example@example.com';
  let results, metadata;
  try {
    [results, metadata] = await db.sequelize.query(
      `SELECT id
        FROM users
        WHERE users.email = ? AND
          deletedAt IS NULL
        ORDER BY id DESC LIMIT 1`, 
      {
          replacements: [ adminUser, ],
          type: QueryTypes.SELECT,
      },
    );
  } catch (err) {
    if ("production" !== config.nodeEnv) {
      console.log(err.message);
    }
  }

  const title = { title: 'Dashboard', };
  const session = {};
  session.auth = {
    name: 'Jane Doe',
    lastLogin: '2023-07-03 16:40:00',
    permissions: [
      'view client',
      'create client',
      'view user',
      'create user',
      'view log',
      'create log',
    ], 
  };
  
  return res.render('home', {
      config,
      title,
      session,
  });
})

module.exports = home;