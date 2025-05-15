'use strict';
exports.mysqlTimeFormat = "YYYY-MM-DD HH:mm:ss";

/**
 * @param {number} firstUnix
 * @param {string} operator
 * @param {number} secondUnix
 * @throws Will throw an error if operator is invalid.
 * @throws Will throw an error if firstUnix is not a number.
 * @throws Will throw an error if secondUnix is not a number.
 */
exports.unixCompare = (firstUnix, operator, secondUnix) => {
  if (typeof firstUnix !== "number") {
    throw new Error("The firstUnix parameter must of type number");
  }
  if (typeof secondUnix !== "number") {
    throw new Error("The secondUnix parameter must of type number");
  }
  switch(operator) {
    case "=":
      return firstUnix === secondUnix;
    case "!=":
      return firstUnix !== secondUnix;
    case ">":
      return firstUnix > secondUnix;
    case ">=":
      return firstUnix >= secondUnix;
    case "<":
      return firstUnix < secondUnix;
    case "<=":
      return firstUnix <= secondUnix;
    default:
      throw new Error("Invalid operator given as parameter.");
  }
};