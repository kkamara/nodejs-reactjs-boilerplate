'use strict';
const { DataTypes, } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userCreated: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        username: {
          type: DataTypes.STRING,
        },
        firstName: {
          type: DataTypes.STRING,
        },
        lastName: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING,
        },
        passwordSalt: {
          type: DataTypes.STRING,
        },
        contactNumber: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        streetName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        buildingNumber: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        postcode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        rememberToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        emailResetKey: {
          type: DataTypes.INTEGER,
          allowNull: true,
        }
      }, { transaction, });
      await queryInterface.addIndex('users', ['username'], {
        name: "users_username",
        fields: 'username',
        unique: true,
        transaction,
      });
      await queryInterface.addIndex('users', ['email'], {
        name: "users_email",
        fields: 'email',
        unique: true,
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeIndex('users', 'users_username', { transaction });
      await queryInterface.removeIndex('users', 'users_email', { transaction });
      await queryInterface.dropTable('users', { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};