"use strict";
const { status, } = require("http-status");
const moment = require("moment-timezone");
const { message401, } = require("../../utils/httpResponses");
const db = require("../../models/V1/index");
const asyncHandler = require("express-async-handler");
const config = require("../../config");

function isValidTimeZone(tz) {
  try {
    if (!tz || typeof tz !== 'string') {
      return false;
    }
    // This throws a RangeError if the timezone is invalid
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (e) {
    return false;
  }
};

module.exports.setUserTimezone = asyncHandler(async (req, res, next) => {
  const timezone = req.headerString("timezone");
  if (timezone && isValidTimeZone(timezone)) {
    req.session.timezone = timezone;
  } else {
    req.session.timezone = config.appTimezone;
  }
  return next();
});