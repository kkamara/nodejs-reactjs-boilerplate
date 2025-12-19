'use strict';
const {
  Model,
} = require('sequelize');
const moment = require("moment-timezone");
const { generateToken, } = require("../../utils/tokens");
const { nodeEnv, } = require("../../config");
const { mysqlTimeFormat, unixCompare, } = require("../../utils/time");

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
     * @param {number} bearerToken 
     * @returns {Object|false}
     */
    static async authenticate(bearerToken) {
      if (null === bearerToken.match(/Bearer \w+/g)) {
        return false;
      }
      const extractedToken = bearerToken.split(" ")[1];
      try {
        const authTokenResult = await sequelize.query(
          `SELECT *
            FROM ${this.getTableName()}
            WHERE token = :extractedToken AND deletedAt IS NULL
            ORDER BY id DESC
            LIMIT 1`, 
          {
            replacements: { extractedToken, },
            type: sequelize.QueryTypes.SELECT,
          },
        );
        
        if (0 === authTokenResult.length) {
          return false;
        }
        
        const isValidToken = this.isTokenValid(
          authTokenResult[0].token,
          authTokenResult[0].expiresAt,
        );
        
        if (false === isValidToken) {
          return false;
        }

        return { userID: authTokenResult[0].usersID };
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * Returns true if token has not expired.
     * @param {number} extractedToken 
     * @param {string} expiresAt 
     * @returns {boolean}
     */
    static isTokenValid(extractedToken, expiresAt) {
      const expiresAtUnix = moment(expiresAt)
        .unix();
      const nowUnix = moment().utc()
        .unix();
      try {
        if (true === unixCompare(nowUnix, ">=", expiresAtUnix)) {
          return false;
        }
        return true;
      } catch (err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {string} token
     * @returns {Object|false}
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
     * @returns {Object|false}
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
     * @param {number} usersID
     * @returns {Object|false}
     */
    static async createAuthToken(usersID) {
      try {
        const newToken = generateToken();

        const result = await sequelize.query(
          `INSERT INTO ${this.getTableName()}(usersID, token, expiresAt, createdAt, updatedAt)
            VALUES(:usersID, :token, :expiresAt, :createdAt, :updatedAt)`,
          {
            replacements: {
              token: newToken,
              expiresAt: moment().utc()
                .add(1, "days")
                .format(mysqlTimeFormat),
              createdAt: moment().utc().format(mysqlTimeFormat),
              updatedAt: moment().utc().format(mysqlTimeFormat),
              usersID, 
            },
            type: sequelize.QueryTypes.INSERT,
          },
        );
        
        return { authTokenID: result[0] };
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }
    
    /**
     * @param {number} userID
     * @param {string} token
     * @returns {boolean}
     */
    static async logoutUser(userID, token) {
      try {
        const result = await sequelize.query(
          `UPDATE ${this.getTableName()}
            SET expiresAt = :expiresAt, updatedAt = :updatedAt
            WHERE token = :token AND
              usersID = :userID AND
              deletedAt IS NULL`,
          {
            replacements: {
              expiresAt: moment().utc().format(mysqlTimeFormat),
              updatedAt: moment().utc().format(mysqlTimeFormat),
              token,
              userID,
            },
            type: sequelize.QueryTypes.UPDATE,
          },
        );
        const rowsUpdated = result[1];
        if (0 === rowsUpdated) {
          return false;
        }
        return true;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {number} usersID
     * @returns {boolean}
     * @throws Error when environment is not set to test
     */
    static async testDeleteAllUsersAuthTokens(usersID) {
      if ("test" !== nodeEnv) {
        throw new Error("Environment must be set to test when invoking this method.");
      }
      try {
        await sequelize.query(
          `DELETE FROM ${this.getTableName()}
            WHERE usersID = :usersID;`,
          {
            replacements: { usersID, },
            type: sequelize.QueryTypes.DELETE,
          },
        );
        
        return true;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {number} id
     * @returns {boolean}
     * @throws Error when environment is not set to test
     */
    static async testDeleteUserToken(id) {
      if ("test" !== nodeEnv) {
        throw new Error("Environment must be set to test when invoking this method.");
      }
      try {
        await sequelize.query(
          `DELETE FROM ${this.getTableName()}
            WHERE id = :id;`,
          {
            replacements: { id, },
            type: sequelize.QueryTypes.DELETE,
          },
        );
        
        return true;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }
  }

  UserToken.init({
    usersID: {
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