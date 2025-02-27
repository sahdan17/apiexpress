const Driver = require('./Driver')
const DriveSession = require('./DriveSession')
const LastRecord = require('./LastRecord')
const Vehicle = require('./Vehicle')

const defineAssociations = () => {
    Driver.hasMany(DriveSession, { foreignKey: 'driver_id', as: 'driveSessions' })
    DriveSession.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' })
    Vehicle.hasMany(LastRecord, { foreignKey: 'idDevice', as: 'lastRecords' })
    LastRecord.belongsTo(Vehicle, { foreignKey: 'idDevice', as: 'vehicle' })
    // DriveSession.hasMany(LastRecord, { foreignKey: 'idDevice', as: 'lastRecords' })
    // LastRecord.belongsTo(DriveSession, { foreignKey: 'idDevice', as: 'driveSession' })
}

module.exports = defineAssociations