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
          `SELECT count(${this.getTableName()}.id) as usersCount
            FROM ${this.getTableName()}
           WHERE deletedAt IS NULL`,
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
          `UPDATE ${this.getTableName()} SET updatedAt=NOW()
            WHERE ${this.getTableName()}.id = :id`, 
          {
                replacements: { id, },
                type: QueryTypes.UPDATE,
          },
        );
      } catch(err) {
        return res;
      }

      res = await sequelize.models.user.getUserById(id);
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
          `SELECT id, password, passwordSalt, buildingNumber, city, contactNumber, 
            createdAt, email, emailResetKey, firstName, 
            lastName, password, lastLogin, rememberToken, streetName,
            updatedAt, username
            FROM ${this.getTableName()}
            WHERE ${this.getTableName()}.id=? AND ${this.getTableName()}.deletedAt IS NULL
            LIMIT 1`, 
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
          `SELECT ${this.getTableName()}.id, password, passwordSalt, buildingNumber, 
            city, contactNumber, ${this.getTableName()}.createdAt, email, emailResetKey, firstName, 
            lastName, password, lastLogin, rememberToken, streetName,
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
          `SELECT id, password, passwordSalt, buildingNumber, city, contactNumber, 
            createdAt, email, emailResetKey, firstName, 
            lastName, password, lastLogin, rememberToken, streetName,
            updatedAt, username
            FROM ${this.getTableName()}
            WHERE ${this.getTableName()}.email=? AND ${this.getTableName()}.deletedAt IS NULL
            LIMIT 1`, 
        {
            replacements: [ email, ],
            type: QueryTypes.SELECT,
        },
      );
        res = result;
        return res;
      } catch(err) {
        if ('production' !== config.nodeEnv) {
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
        .user
        .encrypt(config.appKey);
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
          .refreshUser(id);
        if (user === false) {
          return false;
        }
        return result.hash;
      } catch(err) {
        if ('production' !== config.nodeEnv) {
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
        .user
        .getUser(email);
      if (!user) {
        return res;
      }
      
      const compareHash = sequelize.models
        .user
        .compare(
          password,
          user.password,
          user.passwordSalt
        );
      
      if (false === compareHash) {
        return res;
      }
      
      res = await sequelize.models
        .user
        .refreshUser(user.id);
      
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
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    emailResetKey: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'user',
    tableName: "users",
  });
  
  return User;
};