'use strict';
const moment = require("moment-timezone");
const { mysqlTimeFormat, } = require("../utils/time");
const db = require('../models/index');
const { appTimezone, } = require("../config/index");

const { hash, salt } = db.sequelize.models
  .user
  .encrypt('secret');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        username: 'tomato.pear',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mail.com',
        password: hash,
        passwordSalt: salt,
        createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
        updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
      },
      {
        username: 'qiwi',
        firstName: 'Client',
        lastName: 'Admin',
        email: 'clientadmin@mail.com',
        password: hash,
        passwordSalt: salt,
        createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
        updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
      },
      {
        username: 'cabbage.orange',
        firstName: 'Client',
        lastName: 'User',
        email: 'clientuser@mail.com',
        password: hash,
        passwordSalt: salt,
        createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
        updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
