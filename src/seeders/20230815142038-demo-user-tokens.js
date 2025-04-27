'use strict';
const moment = require("moment-timezone");
const db = require('../models/index');
const config = require('../config/index');
const { appTimezone, } = require("../config/index");
const { mysqlTimeFormat, } = require("../utils/time");

const { hash: hash1 } = db.sequelize.models
  .User
  .encrypt(config.appKey);
const { hash: hash2 } = db.sequelize.models
  .User
  .encrypt(config.appKey);
const { hash: hash3 } = db.sequelize.models
  .User
  .encrypt(config.appKey);
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user_tokens', [
      {
        usersId: 1,
        token: hash1,
        createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
        updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
      },
      {
        usersId: 2,
        token: hash2,
        createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
        updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
      },
      {
        usersId: 3,
        token: hash3,
        createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
        updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user_tokens', null, {});
  }
};
