'use strict';

const path = require('path');
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
    appURL: process.env.APP_URL,
    appLocale: process.env.APP_LOCALE,
    appPort: process.env.PORT || process.env.port || 3000,
    databaseURL: process.env.DATABASE_URL,
    dbName: process.env.DB_NAME,
    dbPass: process.env.DB_PASS,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbDialect: process.env.DB_DIALECT,
    dbStorage: process.env.DB_STORAGE,
};

module.exports = config;
