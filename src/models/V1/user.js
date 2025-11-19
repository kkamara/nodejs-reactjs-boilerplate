'use strict';
const { Model, } = require('sequelize');
const { QueryTypes, } = require('sequelize');
const moment = require("moment-timezone");
const {
  nodeEnv,
  appTimezone,
  appURL,
} = require('../../config');
const {
  generateToken,
  encrypt,
  compare,
} = require("../../utils/tokens");
const { validEmailRegex, } = require("../../utils/regexes");
const { mysqlTimeFormat, } = require("../../utils/time");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    /**
     * @param {number} userId
     * @returns {boolean}
     */
    static async updateUserTimestamp(userId) {
      try {
        const result = await sequelize.query(
          `UPDATE ${this.getTableName()}
            SET updatedAt = :updatedAt
            WHERE id = :userId`,
          {
            replacements: {
              updatedAt: moment()
                .utc()
                .format(mysqlTimeFormat),
              userId,
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
     * @param {string} id
     * @return {object|false}
     */
    static async getUserById(id) {
      let res = false;
      try {
        const result = await sequelize.query(
          `SELECT id, firstName, lastName, email,
              password, passwordSalt, avatarName, updatedAt
            FROM ${this.getTableName()}
            WHERE ${this.getTableName()}.id=? AND ${this.getTableName()}.deletedAt IS NULL
            LIMIT 1`, 
          {
              replacements: [ id, ],
              type: QueryTypes.SELECT,
          },
        );
        
        if (0 === result.length) {
          return false;
        }

        res = this.getFormattedUserData(result[0]);
        return res;
      } catch(err) {
        return res;
      }
    }

    /**
     * @param {string} id
     * @return {object|false}
     */
    static async getRawUserById(id) {
      let res = false;
      try {
        const result = await sequelize.query(
          `SELECT id, firstName, lastName, email,
              password, passwordSalt, avatarName, updatedAt
            FROM ${this.getTableName()}
            WHERE ${this.getTableName()}.id=? AND ${this.getTableName()}.deletedAt IS NULL
            LIMIT 1`, 
          {
              replacements: [ id, ],
              type: QueryTypes.SELECT,
          },
        );
        
        if (0 === result.length) {
          return false;
        }

        res = result[0];
        return res;
      } catch(err) {
        return res;
      }
    }

    /**
     * @param {string} token
     * @return {object|false}
     */
    static async getUserByToken(token) {
      let res = false;
      try {
        const result = await sequelize.query(
          `SELECT id, firstName, lastName, email,
              password, passwordSalt, updatedAt
            ${this.getTableName()}.updatedAt, username
            FROM ${this.getTableName()}
            LEFT JOIN ${sequelize.models.userToken.getTableName()} ON ${sequelize.models.userToken.getTableName()}.usersId = ${this.getTableName()}.id
            WHERE ${sequelize.models.userToken.getTableName()}.token=? AND
              ${sequelize.models.user.getTableName()}.deletedAt IS NULL
              ${sequelize.models.userToken.getTableName()}.deletedAt IS NULL
            LIMIT 1`, 
          {
              replacements: [ token, ],
              type: QueryTypes.SELECT,
          },
        );
        
        if (0 === result.length) {
          return false;
        }

        res = this.getFormattedUserData(result[0]);
        return res;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return res;
      }
    }

    /**
     * @param {number} id
     * @return {object|false}
     */
    static async getUser(id) {
      let res = false;
      try {
        const result = await sequelize.query(
          `SELECT id, firstName, lastName, email,
              password, passwordSalt, avatarName, updatedAt
            FROM ${this.getTableName()}
            WHERE ${this.getTableName()}.id=? AND ${this.getTableName()}.deletedAt IS NULL
            LIMIT 1`, 
          {
              replacements: [ id, ],
              type: QueryTypes.SELECT,
          },
        );

        if (0 === result.length) {
          res = false;
          return res;
        }

        res = this.getFormattedUserData(result[0]);
        return res;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return res;
      }
    }

    /**
     * 
     * @param {number} id User's id.
     * @return {string|false} String token. 
     */
    static async getNewToken(id) {
      const result = generateToken();
      try {
        const [addToken, metadata] = await sequelize.query(
          `INSERT INTO ${sequelize.models.userToken.getTableName()}(
              usersId, token, createdAt, updatedAt
            ) VALUES(
              ?, ?, NOW(), NOW()
            )`, 
          {
              replacements: [ id, result.hash, ],
                type: QueryTypes.INSERT,
          },
        );
        
        const user = await sequelize.models
          .user
          .setUpdatedAt(id);
        if (user === false) {
          return false;
        }
        return result.hash;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {number} page
     * @param {number} perPage
     * @returns {object|false}
     */
    static async getUsersPaginated(
      page = 1,
      perPage = 7,
    ) {
      page -= 1;
      const offset = page * perPage;
      try {
        const countResult = await sequelize.query(
          `SELECT count(id) as total
            FROM ${this.getTableName()}
          `,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        
        if (0 === countResult[0].total) {
          page += 1;
          return {
            data: [],
            meta: {
              currentPage: page,
              items: countResult[0].total,
              pages: 0,
              perPage,
            },
          }
        }

        const coreResults = await sequelize.query(
          `SELECT *
            FROM ${this.getTableName()}
            ORDER BY id DESC
            LIMIT :perPage
            OFFSET :offset
          `,
          {
            replacements: { offset, perPage, },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        
        page += 1;
        return {
          data: this.getFormattedUsersData(coreResults),
          meta: {
            currentPage: page,
            items: countResult[0].total,
            pages: Math.ceil(countResult[0].total / perPage),
            perPage,
          },
        }
      } catch (err) {
        if ('production' !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {false|object} bodyInput 
     */
    static getRegisterError(bodyInput) {
      if (undefined === bodyInput.firstName) {
        return "The first name field is required.";
      } else if (typeof bodyInput.firstName !== "string") {
        return "The first name field must be of type string";
      } else if (0 === bodyInput.firstName.trim().length) {
        return "The first name field is required.";
      } else if (20 < bodyInput.firstName.trim().length) {
        return "The first name field length must not exceed 20 characters.";
      } else if (3 > bodyInput.firstName.trim().length) {
        return "The first name field length must be greater than 2 characters.";
      }

      if (undefined === bodyInput.lastName) {
        return "The last name field is required.";
      } else if (typeof bodyInput.lastName !== "string") {
        return "The last name field must be of type string";
      } else if (0 === bodyInput.lastName.trim().length) {
        return "The last name field is required.";
      } else if (20 < bodyInput.lastName.trim().length) {
        return "The last name field length must not exceed 20 characters.";
      } else if (3 > bodyInput.lastName.trim().length) {
        return "The last name field length must be greater than 2 characters.";
      }

      if (undefined === bodyInput.email) {
        return "The email field is required.";
      } else if (typeof bodyInput.email !== "string") {
        return "The email field must be of type string";
      } else if (0 === bodyInput.email.trim().length) {
        return "The email field is required.";
      } else if (30 < bodyInput.email.length) {
        return "The email field length must not exceed 30 characters.";
      } else if (null === bodyInput.email.match(validEmailRegex)) {
        return "The email field must be a valid email address.";
      }

      if (undefined === bodyInput.password) {
        return "The password field is required.";
      } else if (typeof bodyInput.password !== "string") {
        return "The password field must be of type string";
      } else if (0 === bodyInput.password.trim().length) {
        return "The password field is required.";
      } else if (20 < bodyInput.password.length) {
        return "The password field length must not exceed 20 characters.";
      } else if (5 > bodyInput.password.length) {
        return "The password field length must be greater than 5 characters.";
      } else {
        if (undefined === bodyInput.passwordConfirmation) {
          return "The password confirmation field is required.";
        } else if (0 === bodyInput.passwordConfirmation.trim().length) {
          return "The password confirmation field is required.";
        } else if (bodyInput.password !== bodyInput.passwordConfirmation) {
          return "The password confirmation field does not match the password field.";
        }
      }

      return false;
    }

    /**
     * @param {Object} bodyInput
     * @returns {object|false}
     */
    static getCreateUserData(bodyInput) {
      if (undefined === bodyInput.firstName) {
        return false;
      }

      if (undefined === bodyInput.lastName) {
        return false;
      }

      if (undefined === bodyInput.email) {
        return false;
      }

      if (undefined === bodyInput.password) {
        return false;
      }
      
      return {
        firstName: bodyInput.firstName.trim(),
        lastName: bodyInput.lastName.trim(),
        email: bodyInput.email,
        password: bodyInput.password,
      };
    }

    /**
     * @param {string} email
     * @returns {boolean}
     */
    static async emailExists(email) {
      try {
        const results = await sequelize.query(
          `SELECT id
            FROM ${this.getTableName()}
            WHERE email = :email
            ORDER BY id DESC
            LIMIT 1`, 
          {
            replacements: { email, },
            type: sequelize.QueryTypes.SELECT,
          },
        );
        
        if (0 === results.length) {
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
     * @param {string} email
     * @param {number} userId
     * @returns {boolean}
     */
    static async emailExistsNotById(email, userId) {
      try {
        const results = await sequelize.query(
          `SELECT id
            FROM ${this.getTableName()}
            WHERE email = :email AND id != :userId
            ORDER BY id DESC
            LIMIT 1`, 
          {
            replacements: { email, userId, },
            type: sequelize.QueryTypes.SELECT,
          },
        );
        
        if (0 === results.length) {
          return false;
        }
        
        return false;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {Object} data
     * @returns {number|false}
     */
    static async createUser(data) {
      try {
        const { salt, hash, } = encrypt(data.password);

        const result = await sequelize.query(
          `INSERT INTO ${this.getTableName()}
              (firstName, lastName, email, password, passwordSalt, createdAt, updatedAt)
            VALUES(:firstName, :lastName, :email, :password, :passwordSalt, :createdAt, :updatedAt)`,
          {
            replacements: {
              createdAt: moment()
                .utc()
                .format(mysqlTimeFormat),
              updatedAt: moment()
                .utc()
                .format(mysqlTimeFormat),
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              password: hash,
              passwordSalt: salt,
            },
            type: sequelize.QueryTypes.INSERT,
          },
        );
        
        return { userId: result[0] };
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {array} payload
     * @returns {array}
     */
    static getFormattedUsersData(payload) {
      const result = [];
      for (const item of payload) {
        result.push(
          this.getFormattedUserData(item)
        );
      }
      return result;
    }

    /**
     * @param {Object} data
     * @returns {object}
     */
    static getFormattedUserData(data) {
      return {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        avatarPath: data.avatarName ?
          appURL+"/images/profile/"+data.avatarName :
          appURL+"/images/profile/default-avatar.webp",
        createdAt: moment(data.createdAt)
          .tz(appTimezone)
          .format(mysqlTimeFormat),
        updatedAt: moment(data.updatedAt)
          .tz(appTimezone)
          .format(mysqlTimeFormat),
      };
    }

    /**
     * @param {number} email
     * @returns {object|false}
     */
    static async getUserByEmail(email) {
      try {
        const results = await sequelize.query(
          `SELECT *
            FROM ${this.getTableName()}
            WHERE email = :email AND deletedAt IS NULL
            ORDER BY id DESC
            LIMIT 1`,
          {
            replacements: { email, },
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

    /**
     * @param {Object} BodyInput
     * @returns {false|string}
     */
    static getLoginError(bodyInput) {
      if (undefined === bodyInput.email) {
        return "The email field is required.";
      } else if (typeof bodyInput.email !== "string") {
        return "The email field must be of type string";
      } else if (0 === bodyInput.email.trim().length) {
        return "The email field is required.";
      } else if (30 < bodyInput.email.length) {
        return "The email field length must not exceed 30 characters.";
      } else if (null === bodyInput.email.match(validEmailRegex)) {
        return "The email field must be a valid email address.";
      }

      if (undefined === bodyInput.password) {
        return "The password field is required.";
      } else if (typeof bodyInput.password !== "string") {
        return "The password field must be of type string";
      } else if (0 === bodyInput.password.trim().length) {
        return "The password field is required.";
      } else if (20 < bodyInput.password.length) {
        return "The password field length must not exceed 20 characters.";
      } else if (5 > bodyInput.password.length) {
        return "The password field length must be greater than 5 characters.";
      }

      return false;
    }

    /**
     * @param {string} email
     * @param {string} password
     * @returns {object|false}
     */
    static getCleanLoginData(email, password) {
      if (undefined === email) {
        return false;
      }

      if (undefined === password) {
        return false;
      }
      
      return { email, password, };
    }

    /**
     * @param {string} plainTextInput
     * @param {string} passwordHash
     * @param {string} passwordSalt
     * @returns {boolean}
     */
    static async loginUser(plainTextInput, passwordHash, passwordSalt) {
      return compare(plainTextInput, passwordHash, passwordSalt);
    }

    /**
     * @param {string} token
     * @returns {object|false}
     */
    static async getUserByAuthToken(token) {
      try {
        const result = await sequelize.query(
          `SELECT ${sequelize.models.userToken.getTableName()}.*, ${sequelize.models.userToken.getTableName()}.id as ${sequelize.models.userToken.getTableName()}Id, ${this.getTableName()}.*
            FROM ${this.getTableName()}
            INNER JOIN ${sequelize.models.userToken.getTableName()}
              ON ${this.getTableName()}.id = ${sequelize.models.userToken.getTableName()}.usersId
            WHERE ${sequelize.models.userToken.getTableName()}.token = :token AND
              ${sequelize.models.userToken.getTableName()}.deletedAt IS NULL AND
              ${this.getTableName()}.deletedAt IS NULL
            LIMIT 1`,
          {
            replacements: {
              token,
            },
            type: sequelize.QueryTypes.SELECT,
          },
        );

        if (0 === result.length) {
          return false;
        }
        
        return this.getFormattedUserData(result[0]);
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {number} userId
     * @returns {boolean}
     * @throws Error when environment is not set to test
     */
    static async testDeleteUser(userId) {
      if ("test" !== nodeEnv) {
        throw new Error("Environment must be set to test when invoking this method.");
      }
      try {
        await sequelize.query(
          `DELETE FROM ${this.getTableName()}
            WHERE id = :userId;`,
          {
            replacements: { userId, },
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
     * @param {Object} userId
     * @returns {boolean}
     * @throws Error when environment is not set to test
     */
    static async testCreateUser(payload) {
      if ("test" !== nodeEnv) {
        throw new Error("Environment must be set to test when invoking this method.");
      }
      try {
        const { hash, salt } = encrypt(payload.password);

        const result = await sequelize.query(
          `INSERT INTO ${this.getTableName()}
              (email, firstName, lastName, password, passwordSalt, createdAt, updatedAt)
            VALUES(:email, :firstName, :lastName, :password, :passwordSalt, :createdAt, :updatedAt)`,
          {
            replacements: {
              createdAt: moment().utc().format(mysqlTimeFormat),
              updatedAt: moment().utc().format(mysqlTimeFormat),
              email: payload.email,
              firstName: payload.firstName,
              lastName: payload.lastName,
              password: hash,
              passwordSalt: salt,
            },
            type: sequelize.QueryTypes.INSERT,
          },
        );
        
        return { userId: result[0] };
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {number} userId
     * @param {Object} payload
     * @returns {boolean}
     */
    static async updateUser(userId, payload) {
      try {
        const result = await sequelize.query(
          `UPDATE ${this.getTableName()}
            SET firstName = COALESCE(:firstName, firstName),
              lastName = COALESCE(:lastName, lastName),
              email = COALESCE(:email, email),
              password = COALESCE(:password, password),
              passwordSalt = COALESCE(:passwordSalt, passwordSalt),
              avatarName = COALESCE(:avatarName, avatarName),
              updatedAt = COALESCE(:updatedAt, updatedAt)
            WHERE id = :userId`,
          {
            replacements: {
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              password: payload.password,
              passwordSalt: payload.passwordSalt,
              avatarName: payload.avatarName,
              updatedAt: moment()
                .utc()
                .format(mysqlTimeFormat),
              userId,
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
     * @param {number} userId
     * @param {Object} input
     * @returns {false|string}
     */
    static async getUpdateUserError(userId, input) {
      if (undefined === input.firstName) {
        return "The first name field is required.";
      } else if ("string" !== typeof input.firstName) {
        return "The first name field must be of type string.";
      } else if (0 === input.firstName.trim().length) {
        return "The first name field is required.";
      } else if (30 < input.firstName.trim().length) {
        return "The first name field length must be less than 31 characters.";
      } else if (2 > input.firstName.trim().length) {
        return "The first name field length must be greater than 1 character.";
      }
      
      if (undefined === input.lastName) {
        return "The last name field is required.";
      } else if ("string" !== typeof input.lastName) {
        return "The last name field must be of type string.";
      } else if (0 === input.lastName.trim().length) {
        return "The last name field is required.";
      } else if (30 < input.lastName.trim().length) {
        return "The last name field length must be less than 31 characters.";
      } else if (2 > input.lastName.trim().length) {
        return "The last name field length must be greater than 1 character.";
      }
      
      if (undefined === input.email) {
        return "The email field is required.";
      } else if ("string" !== typeof input.email) {
        return "The email field must be of type string.";
      } else if (0 === input.email.trim().length) {
        return "The email field is required.";
      } else if (100 < input.email.length) {
        return "The email field length must be less than 31 characters.";
      } else if (null === input.email.match(validEmailRegex)) {
        return "The email field must be a valid email.";
      } else {
        const foundUserByEmail = await this.getUserByEmail(
          input.email,
        );
        if (
          false !== foundUserByEmail &&
          foundUserByEmail.id !== userId
        ) {
          return "The email field is already taken.";
        }
      }

      if (undefined === input.password) {
        return "The password field is required.";
      } else if ("string" !== typeof input.password) {
        return "The password field must be of type string.";
      } else if (0 < input.password.length) {
        if (6 > input.password.length) {
          return "The password field length must be at least 6 characters.";
        } else if (30 < input.password.length) {
          return "The password field length must be less than 31 characters.";
        } else if (undefined === input.passwordConfirmation) {
          return "The password confirmation field is required.";
        } else if (input.password !== input.passwordConfirmation) {
          return "The password confirmation field does not match the password field.";
        }
      }

      return false;
    }

    /**
     * @param {Object} payload
     * @returns {Object}
     */
    static getUpdateUserData(payload) {
      const result = {};
      if (payload.firstName) {
        result.firstName = payload.firstName.trim();
      }
      if (payload.lastName) {
        result.lastName = payload.lastName.trim();
      }
      if (payload.email) {
        result.email = payload.email;
      }
      if (payload.password) {
        result.password = payload.password;
      }
      return result;
    }

    /**
     * @param {number} userId
     * @returns {boolean}
     */
    static async resetAvatar(userId) {
      try {
        const result = await sequelize.query(
          `UPDATE ${this.getTableName()}
            SET avatarName = null,
              updatedAt = :updatedAt
            WHERE id = :userId`,
          {
            replacements: {
              updatedAt: moment()
                .utc()
                .format(mysqlTimeFormat),
              userId,
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
  }
  
  User.init({
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
    avatarName: {
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'user',
    tableName: "users",
  });
  
  return User;
};