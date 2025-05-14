'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('userTokens', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        usersId: {
          type: Sequelize.INTEGER
        },
        token: {
          type: Sequelize.STRING
        },
        expiresAt: {
          allowNull: true,
          type: Sequelize.DATE
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
      await queryInterface.addIndex('userTokens', ['expiresAt'], {
        name: "userTokensExpiresAt",
        fields: 'expiresAt',
        unique: false,
        transaction,
      });
      await queryInterface.addIndex('userTokens', ['createdAt'], {
        name: "userTokensCreatedAt",
        fields: 'createdAt',
        unique: false,
        transaction,
      });
      await queryInterface.addIndex('userTokens', ['updatedAt'], {
        name: "userTokensUpdatedAt",
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
      await queryInterface.removeIndex('userTokens', 'userTokensExpiresAt', { transaction })
      await queryInterface.removeIndex('userTokens', 'userTokensCreatedAt', { transaction });
      await queryInterface.removeIndex('userTokens', 'userTokensUpdatedAt', { transaction });
      await queryInterface.dropTable('userTokens', { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};