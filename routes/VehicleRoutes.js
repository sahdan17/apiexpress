const express = require('express')
const { getVehicle,storeVehicle } = require('../controllers/VehicleController')

const router = express.Router()

router.post('/getVehicle', getVehicle)
router.post('/storeVehicle', storeVehicle)

module.exports = router