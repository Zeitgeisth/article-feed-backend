const {Sequelize, DataTypes} = require('sequelize');
const db = require("../config/db");

const Article = db.define("article", {
    headlines: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    images: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    category:{
        type:DataTypes.STRING,
        allowNull: false,
    },


});

module.exports = Article;