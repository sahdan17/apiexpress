import Driver, { hasMany } from './Driver'
import DriveSession, { belongsTo } from './DriveSession'

const defineAssociations = () => {
    hasMany(DriveSession, { foreignKey: 'driver_id', as: 'driveSessions' })
    belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' })
}

export default defineAssociations