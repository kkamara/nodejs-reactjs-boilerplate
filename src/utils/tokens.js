"use strict";
const { randomBytes, } = require("node:crypto");
const bcrypt = require("bcrypt");

const saltRounds = 10;

/**
 * @param {number} length
 * @returns {string}
 */
exports.generateToken = (length=56) => {
  return Buffer.from(randomBytes(length)).toString('hex');
};

/**
 * @param {string} plaintextPassword
 * @returns {string}
 */
exports.bcryptPassword = (plaintextPassword) => {
  return bcrypt.hashSync(plaintextPassword, saltRounds);
};

/**
 * @param {string} plaintextPassword
 * @param {string} hash
 * @returns {boolean}
 */
exports.bcryptCompare = (plaintextPassword, hash) => {
  return bcrypt.compareSync(plaintextPassword, hash);
};