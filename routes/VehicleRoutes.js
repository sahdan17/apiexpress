const express = require('express')
const { getVehicle, storeVehicle, getVehicleByCat } = require('../controllers/VehicleController')

const router = express.Router()

router.post('/getVehicle', getVehicle)
router.post('/storeVehicle', storeVehicle)
router.post('/getVehicleByCat', getVehicleByCat)

module.exports = router