const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL ,"d4a2nuf0mpmnu9", "zobvhybadxlbpn", "6a09d9e9c1715caca2b7fbde59be0c8ce689451a8b5244b916b17512f432b29a", {
    dialect: "postgres",
    port: 5432,

    pool:{
        max:5,
        min:0,
        acquire: 3000,
        idle: 10000,
    },
});

module.exports = sequelize;