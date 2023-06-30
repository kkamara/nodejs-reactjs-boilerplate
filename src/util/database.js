const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  'nodejs_sequelize',
  'root',
  'secret',
  { dialect: 'mysql', host: 'localhost', port: 3306, },
)

module.exports = sequelize
