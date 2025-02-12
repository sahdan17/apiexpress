const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

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
  idDevice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: false,
    unique: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'lastrecord'
})

module.exports = LastRecord
