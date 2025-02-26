const express = require('express')
const { storeRFIDTemp } = require('../controllers/DriverController')

const router = express.Router()

router.post('/storeRFIDTemp', storeRFIDTemp)

module.exports = router
