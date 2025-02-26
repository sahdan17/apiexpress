const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Driver = sequelize.define('drivers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    driver_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    rfid: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    no_wa: {
        type: DataTypes.STRING(15),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'drivers'
})

module.exports = Driver