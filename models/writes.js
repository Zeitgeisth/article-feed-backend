const {Sequelize, DataTypes, Deferrable} = require('sequelize');
const db = require('../config/db');
const User = require('../models/user');
const Article = require('../models/article');

const Writes = db.define("writes", {
    like:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        references: {
            model: "user",
            key:"id",
        },
    },
    dislike:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        references: {
            model: "user",
            key:"id",
        },
    }, 

    block:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "user",
            key:"id",
        },
    },

});

User.belongsToMany(Article, {through: Writes});

module.exports = Writes;