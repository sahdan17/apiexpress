const express = require('express')
const { getLatestRecords, storeRecord, getHistory, getLatestRecordsById } = require('../controllers/RecordController')

const router = express.Router()

router.post('/latestRecords', getLatestRecords)
router.post('/getLatestRecordsById', getLatestRecordsById)
router.post('/storeRecord', storeRecord)
router.post('/history', getHistory)

module.exports = router
