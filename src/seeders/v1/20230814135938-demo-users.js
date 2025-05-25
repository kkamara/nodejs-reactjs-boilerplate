'use strict';
const moment = require("moment-timezone");
const { faker, } = require('@faker-js/faker');
const { mysqlTimeFormat, } = require("../../utils/time");
const { appTimezone, } = require("../../config/index");
const { encrypt, } = require("../../utils/tokens");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    const fakeUsers = [];
    let pwd;

    for(let i=0; i < 31; i++) {
      pwd = encrypt("secret");
      fakeUsers.push({
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: pwd.hash,
        passwordSalt: pwd.salt,
        createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
        updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
      })
    }
    
    pwd = encrypt("secret");
    fakeUsers.push({
      email: "jane@doe.com",
      firstName: "Jane",
      lastName: "Doe",
      password: pwd.hash,
      passwordSalt: pwd.salt,
      createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
      updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
    })

    return queryInterface.bulkInsert('users', [
      ...fakeUsers,
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
