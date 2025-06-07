'use strict';
const path = require('node:path');
const dotenv = require('dotenv');

if ('production' !== process.env.NODE_ENV) {
  const parseEnvFile = dotenv.config({
    path: path.join(
      __dirname, 
      '../', 
      '../',
      '.env',
    ),
  });

  if (parseEnvFile.error) {
    throw parseEnvFile.error;
  }
}

const config = {
  asset: path => {
      if (path[0] === '/') return `${path}`;
      return `/${path}`;
  },
  appName: process.env.APP_NAME,
  appKey: process.env.APP_KEY,
  nodeEnv: process.env.NODE_ENV,
  appDebug: process.env.APP_DEBUG == 'true',
  appTimezone: process.env.APP_TIMEZONE,
  sequelizeTimezone: process.env.SEQUELIZE_TIMEZONE,
  appURL: process.env.APP_URL,
  appPort: process.env.PORT || process.env.port || 8000,
  allowedOrigins: process.env.ALLOWED_ORIGINS,
};

module.exports = config;
