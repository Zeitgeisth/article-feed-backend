const {Sequelize, DataTypes} = require('sequelize');
const db = require("../config/db");

const User = db.define("user", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    dob:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    preferences:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    }
});

module.exports = User;