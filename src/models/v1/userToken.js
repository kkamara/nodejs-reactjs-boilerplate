'use strict';
const {
  Model,
} = require('sequelize');
const moment = require("moment-timezone");
const { generateToken, } = require("../../utils/tokens");
const { nodeEnv, appTimezone, } = require("../../config");
const { mysqlTimeFormat, } = require("../../utils/time");

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
        
        if (undefined === results) {
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

    /**
     * @param {string} id
     * @returns {object|false}
     */
    static async getAuthToken(id) {
      try {
        const results = await sequelize.query(
          `SELECT *
            FROM ${this.getTableName()}
            WHERE id = :id AND deletedAt IS NULL
            ORDER BY id DESC
            LIMIT 1`,
          {
            replacements: { id, },
            type: sequelize.QueryTypes.SELECT,
          },
        );
        
        if (undefined === results) {
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
    
    /**
     * @param {number} usersId
     * @returns {object|false}
     */
    static async createAuthToken(usersId) {
      try {
        const newToken = generateToken();

        const result = await sequelize.query(
          `INSERT INTO ${this.getTableName()}(usersId, token, expiresAt, createdAt, updatedAt)
            VALUES(:usersId, :token, :expiresAt, :createdAt, :updatedAt)`,
          {
            replacements: {
              token: newToken,
              expiresAt: moment().tz(appTimezone)
                .add(1, "days")
                .format(mysqlTimeFormat),
              createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
              updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
              usersId, 
            },
            type: sequelize.QueryTypes.INSERT,
          },
        );
        
        return { authTokenId: result[0] };
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