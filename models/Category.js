const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kode_cat: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    nama_cat: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'category'
})

module.exports = Category