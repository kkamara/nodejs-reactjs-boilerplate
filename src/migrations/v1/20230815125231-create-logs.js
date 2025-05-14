'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('logs', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        clientId: {
          type: Sequelize.STRING
        },
        userCreated: {
          type: Sequelize.INTEGER
        },
        userModified: {
          type: Sequelize.INTEGER
        },
        title: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        body: {
          type: Sequelize.STRING
        },
        notes: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      }, { transaction, });
      await queryInterface.addIndex('logs', ['createdAt'], {
        name: "logsCreatedAt",
        fields: 'createdAt',
        unique: false,
        transaction,
      });
      await queryInterface.addIndex('logs', ['updatedAt'], {
        name: "logsUpdatedAt",
        fields: 'updatedAt',
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
      await queryInterface.removeIndex('logs', 'logsCreatedAt', { transaction });
      await queryInterface.removeIndex('logs', 'logsUpdatedAt', { transaction });
      await queryInterface.dropTable('logs', { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};