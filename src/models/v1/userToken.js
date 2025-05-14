'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    /**
     * @param {string} token
     * @returns {object|false}
     */
    static async getAuthTokenByToken(token) {
      try {
        const results = await sequelize.query(
          `SELECT *
            FROM ${this.getTableName()}
            WHERE token = :token AND deletedAt IS NULL
            ORDER BY id DESC
            LIMIT 1`,
          {
            replacements: { token, },
            type: sequelize.QueryTypes.SELECT,
          },
        );
        
        if (0 === results.length) {
          return false;
        }
        
        return results[0];
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }
  }

  UserToken.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    usersId: {
      type: DataTypes.INTEGER
    },
    token: {
      type: DataTypes.STRING
    },
    expiredAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'userToken',
    tableName: "userTokens",
  });
  
  return UserToken;
};