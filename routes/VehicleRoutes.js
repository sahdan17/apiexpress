const express = require('express')
const { getVehicle, storeVehicle, getVehicleByCat, updateVehicle, deleteVehicle } = require('../controllers/VehicleController')
const authenticateToken = require('../middlewares/AuthMiddleware')

const router = express.Router()

router.post('/getVehicle', authenticateToken, getVehicle)
router.post('/storeVehicle', authenticateToken, storeVehicle)
router.post('/getVehicleByCat', authenticateToken, getVehicleByCat)
router.post('/updateVehicle', authenticateToken, updateVehicle)
router.post('/deleteVehicle', authenticateToken, deleteVehicle)

module.exports = router