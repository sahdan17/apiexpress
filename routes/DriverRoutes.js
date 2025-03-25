const express = require('express')
const { storeRFIDTemp, createDriver, driveSession } = require('../controllers/DriverController')
const authenticateToken = require('../middlewares/AuthMiddleware')

const router = express.Router()

router.post('/storeRFIDTemp', storeRFIDTemp)
router.post('/createDriver', authenticateToken, createDriver)
router.post('/driveSession', driveSession)

module.exports = router
