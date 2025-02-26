const express = require('express')
const { storeRFIDTemp, createDriver, driveSession } = require('../controllers/DriverController')

const router = express.Router()

router.post('/storeRFIDTemp', storeRFIDTemp)
router.post('/createDriver', createDriver)
router.post('/driveSession', driveSession)

module.exports = router
