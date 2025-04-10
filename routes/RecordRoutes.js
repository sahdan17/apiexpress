const express = require('express')
const { 
    getLatestRecords, 
    storeRecord, 
    getHistory, 
    getLatestRecordsById, 
    formatKML, 
    checkArea, 
    getGeofence, 
    getPolygon,
    getPolygonById,
    convertKML,
    getRoutes,
    getRouteById,
    deleteRoute,
    getGeofenceById,
    renameRoute,
    makePolygonn
} = require('../controllers/RecordController')

const authenticateToken = require('../middlewares/AuthMiddleware')

const router = express.Router()
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

router.post('/latestRecords', authenticateToken, getLatestRecords)
router.post('/getLatestRecordsById', authenticateToken, getLatestRecordsById)
router.post('/storeRecord', storeRecord)
router.post('/history', authenticateToken, getHistory)
// router.post('/formatKML', formatKML)
router.post('/checkArea', checkArea)
router.post('/getGeofence', authenticateToken, getGeofence)
router.post('/getGeofenceById', authenticateToken, getGeofenceById)
router.post('/getPolygon', authenticateToken, getPolygon)
router.post('/getPolygonById', authenticateToken, getPolygonById)
router.post('/getRoutes', authenticateToken, getRoutes)
router.post('/getRouteById', authenticateToken, getRouteById)
router.post('/deleteRoute', authenticateToken, deleteRoute)
router.post('/convertKML', authenticateToken, upload.single("file"), convertKML)
router.post('/renameRoute', authenticateToken, renameRoute)
router.post('/makePolygon', makePolygonn)

module.exports = router
