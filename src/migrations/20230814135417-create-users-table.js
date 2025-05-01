'use strict';
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
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        username: {
          type: Sequelize.STRING,
        },
        firstName: {
          type: Sequelize.STRING,
        },
        lastName: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
        },
        passwordSalt: {
          type: Sequelize.STRING,
        },
        contactNumber: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        streetName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        buildingNumber: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        postcode: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        rememberToken: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        lastLogin: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        emailResetKey: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      }, { transaction, });
      await queryInterface.addIndex('users', ['username'], {
        name: "usersUsername",
        fields: 'username',
        unique: true,
        transaction,
      });
      await queryInterface.addIndex('users', ['email'], {
        name: "usersEmail",
        fields: 'email',
        unique: true,
        transaction,
      });
      await queryInterface.addIndex('users', ['createdAt'], {
        name: "usersCreatedAt",
        fields: 'createdAt',
        unique: false,
        transaction,
      });
      await queryInterface.addIndex('users', ['updatedAt'], {
        name: "usersUpdatedAt",
        fields: 'updatedAt',
        unique: false,
        transaction,
      });
      await queryInterface.addIndex('users', ['lastLogin'], {
        name: "usersLastLogin",
        fields: 'lastLogin',
        unique: false,
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
      await queryInterface.removeIndex('users', 'usersUsername', { transaction });
      await queryInterface.removeIndex('users', 'usersEmail', { transaction });
      await queryInterface.removeIndex('users', 'usersCreatedAt', { transaction });
      await queryInterface.removeIndex('users', 'usersUpdatedAt', { transaction });
      await queryInterface.removeIndex('users', 'usersLastLogin', { transaction });
      await queryInterface.dropTable('users', { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};