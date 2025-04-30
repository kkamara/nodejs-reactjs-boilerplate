'use strict';
const { Model, } = require('sequelize');
const { QueryTypes, } = require('sequelize');
const config = require('../config');
const { validate, } = require('email-validator');
const { 
  scryptSync, 
  randomBytes, 
  timingSafeEqual,
} = require('node:crypto');
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
 
    static async getStats() {
      let res = false;
      try {
        const [results, metadata] = await sequelize.query(
          `SELECT count(users.uid) as usersCount
          FROM users;`,
        );
        res = { usersCount: results[0].usersCount, }
        return { ...res, }
      } catch(err) {
        return res;
      }
    }

    /**
     * Returns the salt and hash
     * @param {string} plainText
     * @return {object} Like { salt, hash, }.
     */
    static encrypt(plainText) {
      const salt = randomBytes(16).toString('hex');
      const hash = scryptSync(plainText, salt, 64)
        .toString('hex');
      return { salt, hash, };
    }

    /**
     * Compare resulting hashes.
     * @param {string} plainText
     * @param {string} hash
     * @param {string} hashSalt
     * @return {bool}
     */
    static compare(plainText, hash, hashSalt) {
      let res = false;
      const hashedBuffer = scryptSync(
        plainText, hashSalt, 64,
      );
      
      const keyBuffer = Buffer.from(hash, 'hex');
      const match = timingSafeEqual(hashedBuffer, keyBuffer);
      
      if (!match) {
        return res;
      }

      res = true;
      return res;
    }

    /**
     * @param {Number} id
     * @return {object|false}
     */
    static async refreshUser(id) {
      let res = false;
      try {
        const result = await sequelize.query(
          `UPDATE users SET updatedAt=NOW()
            WHERE users.uid = :id`, 
          {
                replacements: { id, },
                type: QueryTypes.UPDATE,
          },
        );
      } catch(err) {
        return res;
      }

      res = await sequelize.models.User.getUserById(id);
      return res;
    }

    /**
     * @param {string} id
     * @return {object|false}
     */
    static async getUserById(id) {
      let res = false;
      try {
        const [result, metadata] = await sequelize.query(
          `SELECT uid, password, passwordSalt, buildingNumber, city, contactNumber, 
          createdAt, email, emailResetKey, firstName, 
          lastName, password, lastLogin, rememberToken, streetName,
          updatedAt, username FROM users WHERE users.uid=? LIMIT 1`, 
          {
              replacements: [ id, ],
              type: QueryTypes.SELECT,
          },
        );
        res = result;
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
        const [result, metadata] = await sequelize.query(
          `SELECT users.uid, password, passwordSalt, buildingNumber, 
          city, contactNumber, users.createdAt, email, emailResetKey, firstName, 
          lastName, password, lastLogin, rememberToken, streetName,
          users.updatedAt, username FROM users
          LEFT JOIN user_tokens ON user_tokens.usersId = users.uid
          WHERE user_tokens.token=? LIMIT 1`, 
          {
              replacements: [ token, ],
              type: QueryTypes.SELECT,
          },
        );
        res = result;
        console.log('res',res);
        return res;
      } catch(err) {
        console.log('err',err.message);
        return res;
      }
    }

    /**
     * @param {string} email
     * @return {object|false}
     */
    static async getUser(email) {
      let res = false;
      try {
        const [result, metadata] = await sequelize.query(
          `SELECT uid, password, passwordSalt, buildingNumber, city, contactNumber, 
          createdAt, email, emailResetKey, firstName, 
          lastName, password, lastLogin, rememberToken, streetName,
          updatedAt, username FROM users WHERE users.email=? LIMIT 1`, 
        {
            replacements: [ email, ],
            type: QueryTypes.SELECT,
        },
      );
        res = result;
        return res;
      } catch(err) {
        if (config.nodeEnv !== 'production') {
          console.log('error : '+err.message);
        }
        return res;
      }
    }

    /**
     * 
     * @param {Number} id User's id.
     * @return {string|false} String token. 
     */
    static async getNewToken(id) {
      const result = sequelize.models
        .User
        .encrypt(config.appKey);
      try {
        const [addToken, metadata] = await sequelize.query(
          `INSERT INTO user_tokens(
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
          .User
          .refreshUser(id);
        if (user === false) {
          return false;
        }
        return result.hash;
      } catch(err) {
        if (config.nodeEnv !== 'production') {
          console.log('error : '+err.message);
        }
        return false;
      }
    }

    /**
     * Authenticate user credentials.
     * @param {string} email
     * @param {string} password
     * @return {object|false}
     */
    static async authenticate(email, password) {
      let res = false;
      
      const user = await sequelize.models
        .User
        .getUser(email);
      if (!user) {
        return res;
      }
      
      const compareHash = sequelize.models
        .User
        .compare(
          password,
          user.password,
          user.passwordSalt
        );
        
      if (compareHash === false) {
        return res;
      }
      
      res = await sequelize.models
        .User
        .refreshUser(user.uid);
      
      return res;
    }

    /**
    * 
    * @param {string} email 
    * @param {string} password 
    * @return {true|array}
    */
    static validateAuthenticate(email, password) {
      let res = [];
      if (!email) {
        res.push('Missing email field.');
      } else if (email.length > 1024) {
        res.push('Email field exceeds 1024 character limit.')
      } else if (!validate(email)) {
        res.push('Email field must be a valid email.')
      }
      if (!password) {
        res.push('Missing email field.');
      } else if (password.length > 100) {
        res.push('Password field exceeds 100 character limit.')
      }

      if (!res.length) {
        res = true;
      }
      return res;
    }
  }
  
  User.init({
    uid: DataTypes.INTEGER,
    userCreated: DataTypes.INTEGER,
    username: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordSalt: DataTypes.STRING,
    contactNumber: DataTypes.STRING,
    streetName: DataTypes.STRING,
    buildingNumber: DataTypes.STRING,
    city: DataTypes.STRING,
    postcode: DataTypes.STRING,
    rememberToken: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    lastLogin: DataTypes.DATE,
    emailResetKey: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
    tableName: "users",
  });
  
  return User;
};