const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Vehicle = sequelize.define('vehicle', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nopol: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    kode: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'vehicle'
})

module.exports = Vehicle
