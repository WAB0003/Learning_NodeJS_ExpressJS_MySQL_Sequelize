//Bring in Sequelize and connect to existing sequelize db connection
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//USE Sequelize to DEFINE a table.
//https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-define
const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey:true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false, 
  },
  imageUrl: {
    type: Sequelize.STRING, 
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;