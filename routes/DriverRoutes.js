const express = require('express')
const { storeRFIDTemp, createDriver } = require('../controllers/DriverController')

const router = express.Router()

router.post('/storeRFIDTemp', storeRFIDTemp)
router.post('/createDriver', createDriver)

module.exports = router
