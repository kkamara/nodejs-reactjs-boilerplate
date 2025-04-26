'use strict';
const db = require('../models/index');

const { hash, salt } = db.sequelize.models
  .User
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'qiwi',
        firstName: 'Client',
        lastName: 'Admin',
        email: 'clientadmin@mail.com',
        password: hash,
        passwordSalt: salt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'cabbage.orange',
        firstName: 'Client',
        lastName: 'User',
        email: 'clientuser@mail.com',
        password: hash,
        passwordSalt: salt,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
