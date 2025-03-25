const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const moment = require('moment')

const Users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            const value = this.getDataValue('timestamp')        
            return value ? moment(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    remember_token: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    role: {
        type: DataTypes.INTEGER(1),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            const value = this.getDataValue('timestamp')        
            return value ? moment(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            const value = this.getDataValue('timestamp')        
            return value ? moment(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null
        }
    }
}, {
    tableName: 'users'
})

module.exports = Users
