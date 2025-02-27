const Driver = require('./Driver')
const DriveSession = require('./DriveSession')

const defineAssociations = () => {
    Driver.hasMany(DriveSession, { foreignKey: 'driver_id', as: 'driveSessions' })
    DriveSession.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' })
}

module.exports = defineAssociations