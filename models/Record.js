const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Record = sequelize.define('record', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
    idDevice: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    tableName: 'record'
})

module.exports = Record
