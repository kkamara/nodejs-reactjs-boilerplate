const Sequelize = require("sequelize");
const { error, log, } = require('console');
const config = require('../config');

let logging = false;
if ('production' !== config.nodeEnv) {
   logging = true;
}

const db = new Sequelize(
   config.dbName,
   config.dbUser,
   config.dbPass,
   {
      host: config.dbHost,
      dialect: config.dbDialect, /* 'mysql' | 'postgres' | 'sqlite' | 'mariadb' */
      storage: config.dbStorage, // when sqlite dialect
      define: {
         timestamps: true,
         createdAt: 'created_at',
         updatedAt: 'updated_at',
      },
      logging,
      pool: {
         max: 5,
         min: 0,
         acquire: 30000,
         idle: 10000,
      },
   },
);

db.authenticate().then(() => {
   if (config.nodeEnv !== 'production') {
      log('Connection has been established successfully.');
   }
}).catch((err) => {
   error('Unable to connect to the database: ', err);
});

module.exports = db;
