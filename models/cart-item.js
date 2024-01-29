//Bring in Sequelize and connect to existing sequelize db connection
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//USE Sequelize to DEFINE a table.
//https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-defines
const CartItem = sequelize.define('cartItem',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey:true
  },
  quantity: Sequelize.INTEGER
  });
  
  
  module.exports = CartItem;