const Sequelize = require("sequelize");
const { error, log, } = require('console');
const config = require('../config');

const db = new Sequelize(
   'hello_world_db',
   'root',
   '',
   {
      host: 'localhost',
      dialect: 'mysql', /* 'mysql' | 'postgres' | 'sqlite' | 'mariadb' */
      //storage: 'path/to/sqlitedb', // when sqlite dialect
      define: {
         timestamps: true,
         createdAt: 'created_at',
         updatedAt: 'updated_at',
      },
   },
);

db.authenticate().then(() => {
   log('Connection has been established successfully.');
}).catch((err) => {
   error('Unable to connect to the database: ', err);
});

module.exports = db;
