"use strict";
const fs = require("node:fs");
const morgan = require("morgan");
const config = require("../../config");
const moment = require("moment-timezone");
const path = require("node:path");

const logFileName = "boilerplate.log";
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "..", "..", "..",  "logs", logFileName), 
  { flags: "a" },
);
morgan.token("date", (req, res, tz) => {
  return moment().tz(tz).format("YYYY-MM-DD HH:mm:ss");
});
const logName = "boilerplate-request-log-format";
morgan.format(
  logName,
  `:remote-addr - :remote-user [:date[${config.appTimezone}]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`,
);

module.exports.requestLog = morgan(
  logName,  
  { stream: accessLogStream, },
);