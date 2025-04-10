const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Routes = sequelize.define('routes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    path_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    tolerance: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'routes'
})

module.exports = Routes
