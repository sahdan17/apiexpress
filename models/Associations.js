import Driver, { hasMany } from './Driver'
import DriveSession, { belongsTo } from './DriveSession'
import Vehicle, { hasMany } from './Vehicle'
import LastRecord, { belongsTo } from './LastRecord'

const defineAssociations = () => {
    hasMany(DriveSession, { foreignKey: 'driver_id', as: 'driveSessions' })
    belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' })
    hasMany(Vehicle, { foreignKey: 'idDevice', as: 'vehicles' })
    belongsTo(LastRecord, { foreignKey: 'idDevice', as: 'lastRecord' })
}

export default defineAssociations