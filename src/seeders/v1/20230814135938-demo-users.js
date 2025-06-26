'use strict';
const moment = require("moment-timezone");
const { faker, } = require('@faker-js/faker');
const { mysqlTimeFormat, } = require("../../utils/time");
const { encrypt, } = require("../../utils/tokens");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const fakeUsers = [];
      let pwd;

      for(let i=0; i < 30; i++) {
        pwd = encrypt("secret");
        fakeUsers.push({
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          password: pwd.hash,
          passwordSalt: pwd.salt,
          createdAt: moment()
            .utc()
            .format(mysqlTimeFormat),
          updatedAt: moment()
            .utc()
            .format(mysqlTimeFormat),
        })
      }
      
      pwd = encrypt("secret");
      fakeUsers.push({
        email: "jane@doe.com",
        firstName: "Jane",
        lastName: "Doe",
        password: pwd.hash,
        passwordSalt: pwd.salt,
        createdAt: moment()
          .utc()
          .format(mysqlTimeFormat),
        updatedAt: moment()
          .utc()
          .format(mysqlTimeFormat),
      })

      await queryInterface.bulkInsert('users', [
        ...fakeUsers,
      ], { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('users', null, { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
