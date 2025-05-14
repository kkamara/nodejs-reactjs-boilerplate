'use strict';
const moment = require("moment-timezone");
const config = require('../config/index');
const { appTimezone, } = require("../config/index");
const { mysqlTimeFormat, } = require("../utils/time");
const { generateToken, } = require("../utils/tokens");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('userTokens', [
        {
          usersId: 1,
          token: generateToken(),
          createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
          updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
        },
        {
          usersId: 2,
          token: generateToken(),
          createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
          updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
        },
        {
          usersId: 3,
          token: generateToken(),
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
