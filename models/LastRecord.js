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
        allowNull: false
    },
    sat: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dir: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('start', 'stop', 'idle'),
        allowNull: false
    },
    rpm: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    coolant_temp: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: false
    },
    fuel_consumption: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: false
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
