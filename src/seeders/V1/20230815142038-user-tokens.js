'use strict';
const moment = require("moment-timezone");
const { mysqlTimeFormat, } = require("../../utils/time");
const { generateToken, } = require("../../utils/tokens");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('userTokens', [
        {
          usersID: 31,
          token: generateToken(),
          expiresAt: moment().utc().add(1, "days").format(mysqlTimeFormat),
          createdAt: moment()
            .utc()
            .format(mysqlTimeFormat),
          updatedAt: moment()
            .utc()
            .format(mysqlTimeFormat),
        },
      ], { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('userTokens', null, { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
