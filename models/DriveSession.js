const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const VehicleDriver = sequelize.define('drive_session', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    kode_vehicle: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: true
    },
    stop: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
  timestamps: false,
  tableName: 'drive_session'
})

module.exports = VehicleDriver
