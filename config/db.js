const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL ,"articlefeed", "postgres", "root", {
    host: "ec2-44-194-225-27.compute-1.amazonaws.com",
    dialect: "postgres",
    protocol: "postgres",
    operatorsAliases: 0,
    port: 5432,

    pool:{
        max:5,
        min:0,
        acquire: 3000,
        idle: 10000,
    },
});

module.exports = sequelize;