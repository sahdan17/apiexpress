const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const moment = require('moment')

const DriveSession = sequelize.define('drive_session', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    vehicle_id: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            const value = this.getDataValue('start')
            return value ? moment(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null
        }
    },
    stop: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            const value = this.getDataValue('stop')
            return value ? moment(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null
        }
    }
}, {
    timestamps: false,
    tableName: 'drive_session'
})

module.exports = DriveSession
