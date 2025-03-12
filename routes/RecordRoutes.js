const express = require('express')
const { 
    getLatestRecords, 
    storeRecord, 
    getHistory, 
    getLatestRecordsById, 
    formatKML, 
    checkArea, 
    getGeofence, 
    convertKML 
} = require('../controllers/RecordController')

const router = express.Router()
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

router.post('/latestRecords', getLatestRecords)
router.post('/getLatestRecordsById', getLatestRecordsById)
router.post('/storeRecord', storeRecord)
router.post('/history', getHistory)
router.post('/formatKML', formatKML)
router.post('/checkArea', checkArea)
router.post('/getGeofence', getGeofence)
router.post('/convertKML', upload.single("file"), convertKML)

module.exports = router
