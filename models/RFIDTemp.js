const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const RFIDTemp = sequelize.define('rfid_temp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rfid: {
        type: DataTypes.STRING(15),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'rfid_temp'
})

module.exports = RFIDTemp
