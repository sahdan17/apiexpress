const express = require('express')
const { getAllRecords,getLatestRecords,storeRecord,getHistory } = require('../controllers/RecordController')

const router = express.Router()

router.post('/latestRecords', getLatestRecords)
router.post('/storeRecord', storeRecord)
router.post('/history', getHistory)

module.exports = router
