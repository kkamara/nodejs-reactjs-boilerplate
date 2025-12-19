"use strict";
const {
  scryptSync,
  randomBytes,
  timingSafeEqual,
} = require('node:crypto');

/**
 * @param {number} length
 * @returns {string}
 */
exports.generateToken = (length=56) => {
  return Buffer.from(randomBytes(length)).toString('hex');
};

/**
 * Returns the salt and hash.
 * @param {string} plainText
 * @return {Object} Like { salt, hash, }.
 */
exports.encrypt = (plainText) => {
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
exports.compare = (plainText, hash, hashSalt) => {
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