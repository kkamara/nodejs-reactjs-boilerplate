'use strict';
const moment = require("moment-timezone");
const db = require('../models/index');
const config = require('../config/index');
const { appTimezone, } = require("../config/index");
const { mysqlTimeFormat, } = require("../utils/time");

const { hash: hash1 } = db.sequelize.models
  .user
  .encrypt(config.appKey);
const { hash: hash2 } = db.sequelize.models
  .user
  .encrypt(config.appKey);
const { hash: hash3 } = db.sequelize.models
  .user
  .encrypt(config.appKey);
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('userTokens', [
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
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('userTokens', null, { transaction, });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
