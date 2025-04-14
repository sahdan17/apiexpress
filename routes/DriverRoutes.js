const express = require('express')
const { storeRFIDTemp, createDriver, driveSession, getDriver, updateDriver, deleteDriver } = require('../controllers/DriverController')
const authenticateToken = require('../middlewares/AuthMiddleware')

const router = express.Router()

router.post('/storeRFIDTemp', storeRFIDTemp)
router.post('/createDriver', authenticateToken, createDriver)
router.post('/getDriver', authenticateToken, getDriver)
router.post('/deleteDriver', authenticateToken, deleteDriver)
router.post('/updateDriver', authenticateToken, updateDriver)
router.post('/driveSession', driveSession)

module.exports = router
