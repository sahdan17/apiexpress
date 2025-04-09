const Driver = require('./Driver')
const DriveSession = require('./DriveSession')
const LastRecord = require('./LastRecord')
const Record = require('./Record')
const Vehicle = require('./Vehicle')
const Category = require('./Category')

const defineAssociations = () => {
    Driver.hasMany(DriveSession, { foreignKey: 'driver_id', as: 'driveSessions' })
    DriveSession.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' })
    Vehicle.hasMany(LastRecord, { foreignKey: 'idDevice', as: 'lastRecords' })
    LastRecord.belongsTo(Vehicle, { foreignKey: 'idDevice', as: 'vehicle' })
    Vehicle.hasMany(Record, { foreignKey: 'idDevice', as: 'records' })
    Record.belongsTo(Vehicle, { foreignKey: 'idDevice', as: 'vehicle' })
    DriveSession.hasMany(Record, { foreignKey: 'idSession', as: 'record' })
    Record.belongsTo(DriveSession, { foreignKey: 'idSession', as: 'driveSessions' })
    DriveSession.hasMany(LastRecord, { foreignKey: 'idSession', as: 'lastRecord' })
    LastRecord.belongsTo(DriveSession, { foreignKey: 'idSession', as: 'driveSessions' })
    Category.hasMany(Vehicle, { foreignKey: 'cat', targetKey: 'kode_cat', as: 'vehicles' })
    Vehicle.belongsTo(Category, { foreignKey: 'cat', targetKey: 'kode_cat', as: 'category' })
}

module.exports = defineAssociations