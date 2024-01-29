//Bring in Sequelize and connect to existing sequelize db connection
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//USE Sequelize to DEFINE a table.
//https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-define
const User = sequelize.define('user',{      //define(tableName, Attributes Obj)
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true, 
        allowNull: false,
        primaryKey: true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull: false, 
    },
    email:{
        type:Sequelize.STRING
    }

});

module.exports = User;