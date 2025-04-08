const express = require('express')
const { getVehicle, storeVehicle, getVehicleByCat, updateVehicle } = require('../controllers/VehicleController')
const authenticateToken = require('../middlewares/AuthMiddleware')

const router = express.Router()

router.post('/getVehicle', authenticateToken, getVehicle)
router.post('/storeVehicle', authenticateToken, storeVehicle)
router.post('/getVehicleByCat', authenticateToken, getVehicleByCat)
router.post('/updateVehicle', authenticateToken, updateVehicle)

module.exports = router