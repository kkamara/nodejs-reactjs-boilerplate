const { log, } = require('node:console')
const sequelize = require('./util/database')

const Customer = require('./models/customer')
const Order = require('./models/order')

Customer.hasMany(Order)

let customerId = null;

sequelize
  .sync({ force: true, })
  // .sync()
  .then(result => {
    return Customer.create({ name: 'Jane Doe', email: 'js@foobarbazz.com', })
    log(result)
  }).then(customer => {
    customerId = customer.id
    log('First Customer Created: ', customer)
    return customer.createOrder({ total: 45, })
    // return Order.create({ total: 45, })
  })
  .then(order => {
    log('Order is : ', order)
    return Order.findAll({ where: customerId, })
  })
  .then(orders => {
    log('All the Orders are : ', orders)
  })
  .catch(err => {
    log(err)
  })
