'use strict';
const db = require('../models/index');
const config = require('../config/index');
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        usersId: 2,
        token: hash2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        usersId: 3,
        token: hash3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user_tokens', null, {});
  }
};
