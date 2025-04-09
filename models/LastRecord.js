const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const moment = require('moment')

const LastRecord = sequelize.define('lastrecord', {
    lat: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    long: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    speed: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: true
    },
    sat: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    dir: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('start', 'stop', 'idle'),
        allowNull: true
    },
    rpm: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    coolant_temp: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: true
    },
    fuel_consumption: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: true
    },
    idDevice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        unique: true
    },
    idSession: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            const value = this.getDataValue('timestamp')
            return value ? moment(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null
        }
    }
}, {
    timestamps: false,
    tableName: 'lastrecord'
})

module.exports = LastRecord
