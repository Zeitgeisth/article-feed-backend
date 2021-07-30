const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("articlefeed", "postgres", "root", {
    host: "localhost",
    dialect: "postgres",
    operatorsAliases: 0,

    pool:{
        max:5,
        min:0,
        acquire: 3000,
        idle: 10000,
    },
});

module.exports = sequelize;