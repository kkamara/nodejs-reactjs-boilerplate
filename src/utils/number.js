/**
 * @param {number} subject
 * @returns {string}
 */
exports.roundTo2FixedPoints = subject => 
  (Math.round((subject + Number.EPSILON) * 100) / 100)
          .toFixed(2);