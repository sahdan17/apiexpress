const express = require('express')
const { getLatestRecords, storeRecord, getHistory, getLatestRecordsById, formatKML, checkArea } = require('../controllers/RecordController')

const router = express.Router()

router.post('/latestRecords', getLatestRecords)
router.post('/getLatestRecordsById', getLatestRecordsById)
router.post('/storeRecord', storeRecord)
router.post('/history', getHistory)
router.post('/formatKML', formatKML)
router.post('/checkArea', checkArea)

module.exports = router
