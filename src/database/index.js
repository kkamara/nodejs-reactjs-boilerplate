const Sequelize = require("sequelize");
const { error, log, } = require('console');

const db = new Sequelize(
 'hello_world_db',
 'root',
 '',
  {
    host: 'localhost',
    dialect: 'mysql', /* 'mysql' | 'postgres' | 'sqlite' | 'mariadb' */
    //storage: 'path/to/sqlitedb', // when sqlite dialect
  },
);

db.authenticate().then(() => {
   log('Connection has been established successfully.');
}).catch((err) => {
   error('Unable to connect to the database: ', err);
});

module.exports = db;
