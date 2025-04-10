const Record = require('../models/Record')
const LastRecord = require('../models/LastRecord')
const Vehicle = require('../models/Vehicle')
const Routes = require('../models/Routes')
const { Op, QueryTypes, where } = require("sequelize")
const moment = require('moment')
const fs = require("fs")
const turf = require("@turf/turf")
const DriveSession = require('../models/DriveSession')
const Driver = require('../models/Driver')
const axios = require("axios")
const { DOMParser } = require("@xmldom/xmldom")
const path = require("path")
const sequelize = require('../config/database')

exports.storeRecord = async (req, res) => {
    try {
        const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
        let { lat, long, speed, sat, dir, status, rpm, temp, fuel, idDevice } = req.body

        const dataDir = path.join(__dirname, "../data")
        const filePath = path.join(dataDir, `last_position_${idDevice}.json`)

        if (status === "idle" || status === "stop") {
            if (fs.existsSync(filePath)) {
                const lastData = JSON.parse(fs.readFileSync(filePath, "utf-8"))
                lat = lastData.lat
                long = lastData.long
            }
        }

        const driveSesion = await DriveSession.findOne({
            where: {
                vehicle_id: idDevice,
                stop: null
            },
            order: [
                ['id', 'DESC']
            ]
        })

        let idDS = null

        if (driveSesion) {
            idDS = driveSesion.id
        }

        await Record.create({
            lat: lat,
            long: long,
            speed: speed,
            sat: sat,
            dir: dir,
            status: status,
            rpm: rpm,
            coolant_temp: temp,
            fuel_consumption: fuel,
            idDevice: idDevice,
            idSession: idDS,
            timestamp: timestamp
        })

        await LastRecord.upsert({
            idDevice: idDevice,
            idSession: idDS,
            lat: lat,
            long: long,
            speed: speed,
            sat: sat,
            dir: dir,
            status: status,
            rpm: rpm,
            coolant_temp: temp,
            fuel_consumption: fuel,
            timestamp: timestamp
        })

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true })
        }

        const fileData = {
            idDevice,
            lat,
            long,
            timestamp
        }
        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2))

        const areaCheckResult = await checkAreaInternal(lat, long)

        if (areaCheckResult.inArea == false) {
            try {
                const vehicle = await Vehicle.findOne({
                    where: {
                        id: idDevice
                    }
                })

                // await axios.post("https://foljambiold.findingoillosses.com/api/sendToDB",
                await axios.post("http://213.210.21.34:15002/api/sendToDB",
                    {
                        message: `${vehicle.nopol} | ${vehicle.kode} melintas di luar jalur`,
                        target: "120363288603708376@g.us"
                    }, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
            } catch (err) {
                res.status(500).json({ message: err.message })
            }
        }

        res.json({
            status: "success",
            message: "Data berhasil disimpan",
            areaCheck: areaCheckResult
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const checkAreaInternal = async (lat, long) => {
    try {
        const data = fs.readFileSync("./kmz/polygon_vt.json", "utf8")
        const polygons = JSON.parse(data)

        const point = turf.point([long, lat])
        let inArea = false
        let matchedIndex = -1
        let minDistance = Infinity

        polygons.forEach((coords, index) => {
            const polygon = turf.polygon([coords])

            if (turf.booleanPointInPolygon(point, polygon)) {
                inArea = true
                matchedIndex = index
            } else {
                // Hitung jarak ke sisi polygon terdekat
                const line = turf.lineString(coords.map(([lat, lng]) => [lng, lat]))
                const nearest = turf.nearestPointOnLine(line, point)
                const distance = turf.distance(point, nearest, { units: "meters" })

                if (distance < minDistance) {
                    minDistance = distance
                }
            }
        })

        return {
            point: { latitude: lat, longitude: long },
            inArea,
            index: matchedIndex,
            distance: inArea ? 0 : minDistance.toFixed(2),
            message: inArea
                ? "Titik berada dalam polygon"
                : `Titik berada di luar area, jarak terdekat ${minDistance.toFixed(2)} meter`
        }
    } catch (error) {
        return { message: "Gagal memeriksa area", error: error.message }
    }
}

exports.checkArea = async (req, res) => {
    try {
        const { point } = req.body

        if (!point) {
            return res.status(400).json({ message: "Point is required in the format 'lat,lng'" })
        }

        const coords = point.split(",").map(Number)

        if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
            return res.status(400).json({ message: "Invalid point format. Use 'lat,lng'" })
        }

        const [lat, lng] = coords

        const areaCheckResult = await checkAreaInternal(lat, lng)

        // if (areaCheckResult.inArea == false) {
        //     try {
        //         const vehicle = await Vehicle.findOne({
        //             where: {
        //                 id: 1
        //             }
        //         })

        //         await axios.post("https://foljambiold.findingoillosses.com/api/sendToDB",
        //             {
        //                 headers: {
        //                     "Content-Type": "application/json",
        //                     "Accept": "application/json",
        //                     "Access-Control-Allow-Origin": "*"
        //                 }
        //             },
        //             {
        //                 message: `${vehicle.nopol} | ${vehicle.kode} melintas di luar jalur`,
        //                 target: "120363288603708376@g.us"
        //             }
        //         )
        //     } catch (err) {
        //         res.status(500).json({ message: err.message })
        //     }
        // }

        res.json(areaCheckResult)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getGeofence = async (req, res) => {
    try {
        const data = fs.readFileSync("./kmz/rute_vt.json", "utf8")
        const geofenceArray = JSON.parse(data)

        if (!Array.isArray(geofenceArray)) {
            return res.status(500).json({ message: "Invalid geofence data format" })
        }

        res.json(geofenceArray)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getGeofenceById = async (req, res) => {
    try {
        const { id } = req.body
        
        const data = fs.readFileSync("./kmz/rute_vt.json", "utf8")
        const geofenceArray = JSON.parse(data)

        if (!Array.isArray(geofenceArray)) {
            return res.status(500).json({ message: "Invalid geofence data format" })
        }

        const ids = Array.isArray(id) ? id : [id]
        const parsedIds = ids.map(i => parseInt(i)).filter(i => !isNaN(i))

        const selectedGeofences = parsedIds
            .map(index => geofenceArray[index])
            .filter(item => item !== undefined)

        res.json(selectedGeofences)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getPolygon = async (req, res) => {
    try {
        const data = fs.readFileSync("./kmz/polygon_vt.json", "utf8")
        const geofenceArray = JSON.parse(data)

        if (!Array.isArray(geofenceArray)) {
            return res.status(500).json({ message: "Invalid geofence data format" })
        }

        res.json(geofenceArray)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getPolygonById = async (req, res) => {
    try {
        const { id } = req.body
        
        const data = fs.readFileSync("./kmz/polygon_vt.json", "utf8")
        const geofenceArray = JSON.parse(data)

        if (!Array.isArray(geofenceArray)) {
            return res.status(500).json({ message: "Invalid geofence data format" })
        }

        const ids = Array.isArray(id) ? id : [id]
        const parsedIds = ids.map(i => parseInt(i)).filter(i => !isNaN(i))

        const selectedGeofences = parsedIds
            .map(index => geofenceArray[index])
            .filter(item => item !== undefined)

        res.json(selectedGeofences)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getLatestRecords = async (req, res) => {
    try {
        const records = await LastRecord.findAll()
        res.json(records)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getLatestRecordsById = async (req, res) => {
    try {
        const { ids } = req.body

        const records = await LastRecord.findAll({
            where: {
                idDevice: ids
            },
            include: [
                {
                    model: DriveSession,
                    as: 'driveSessions',
                    include: [
                        {
                            model: Driver,
                            as: 'driver'
                        }
                    ]
                },
                {
                    model: Vehicle,
                    as: 'vehicle'
                }
            ]
        })

        res.json({
            records: records,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getHistory = async (req, res) => {
    try {
        const { date, idDevice } = req.body

        const nextDay = moment(date, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')

        const records = await Record.findAll({
            where: {
                idDevice: idDevice,
                timestamp: {
                    [Op.gte]: date,
                    [Op.lt]: nextDay
                }
            },
            include: [
                {
                    model: DriveSession,
                    as: 'driveSessions',
                    include: [
                        {
                            model: Driver,
                            as: 'driver'
                        }
                    ]
                },
                {
                    model: Vehicle,
                    as: 'vehicle'
                }
            ]
        })

        res.json(records)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.formatKML = async (req, res) => {
    try {
        const { input } = req.body

        if (!input) {
            return res.status(400).json({ message: "Input is required" })
        }

        const coordinates = input.split(" ").map(coord => {
            const [x, y] = coord.split(",").map(Number)
            return [x, y]
        })

        res.json(coordinates)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.convertKML = async (req, res) => {
    try {
        const { tolerance } = req.body

        if (!req.file) {
            return res.status(400).json({ message: "File KML belum diunggah" })
        }

        const inputFilePath = req.file.path
        const kmlData = fs.readFileSync(inputFilePath, "utf8")

        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(kmlData, "text/xml")

        const placemarks = xmlDoc.getElementsByTagName("Placemark")

        if (placemarks.length === 0) {
            fs.unlinkSync(inputFilePath)
            return res.status(500).json({ message: "Tidak ada data <Placemark> dalam file KML" })
        }

        const kmzFolderPath = path.join(__dirname, "../kmz")
        const outputFilePath = path.join(kmzFolderPath, "rute_vt.json")

        if (!fs.existsSync(kmzFolderPath)) {
            fs.mkdirSync(kmzFolderPath, { recursive: true })
        }

        let existingData = []

        if (fs.existsSync(outputFilePath)) {
            const rawData = fs.readFileSync(outputFilePath, "utf8").trim()
            try {
                existingData = rawData ? JSON.parse(rawData) : []
                if (!Array.isArray(existingData)) {
                    existingData = []
                }
            } catch (error) {
                existingData = []
            }
        }

        let newCoordinates = []
        let routesToInsert = []

        for (let i = 0; i < placemarks.length; i++) {
            const placemark = placemarks[i]

            const nameElement = placemark.getElementsByTagName("name")[0]
            const nameText = nameElement ? nameElement.textContent.trim() : `Path ${i + 1}`

            const coordinatesElement = placemark.getElementsByTagName("coordinates")[0]
            if (!coordinatesElement) continue

            const coordText = coordinatesElement.textContent.trim()

            if (!coordText) continue

            const coords = coordText.split(/\s+/).map(coord => {
                const [x, y] = coord.split(",").map(Number)
                return [x, y]
            })

            const pathId = existingData.length + newCoordinates.length

            newCoordinates.push(coords)

            routesToInsert.push(`(${pathId}, '${nameText.replace(/'/g, "''")}', ${tolerance})`)
        }

        if (newCoordinates.length === 0) {
            fs.unlinkSync(inputFilePath)
            return res.status(500).json({ message: "Parsing gagal, tidak ada koordinat dalam <Placemark>" })
        }

        existingData.push(...newCoordinates)

        fs.writeFileSync(outputFilePath, JSON.stringify(existingData, null, 2))

        if (routesToInsert.length > 0) {
            const query = `INSERT INTO routes (path_id, name, tolerance) VALUES ${routesToInsert.join(", ")}`
            await sequelize.query(query, { type: QueryTypes.INSERT })
        }

        fs.unlinkSync(inputFilePath)

        makePolygon(tolerance, newCoordinates, existingData.length - newCoordinates.length)

        res.json({
            message: "Konversi berhasil",
            filePath: outputFilePath,
            data: existingData,
            routes: routesToInsert
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

function makePolygon(tolerance, newPolylines, startIndex) {
    try {
        const outputPath = path.join(__dirname, '..', 'kmz', 'polygon_vt.json')

        let existingPolygons = []

        if (fs.existsSync(outputPath)) {
            const raw = fs.readFileSync(outputPath, 'utf8').trim()
            try {
                existingPolygons = raw ? JSON.parse(raw) : []
                if (!Array.isArray(existingPolygons)) existingPolygons = []
            } catch (err) {
                existingPolygons = []
            }
        }

        for (let i = 0; i < newPolylines.length; i++) {
            const polyline = newPolylines[i]
            const line = turf.lineString(polyline)
            const buffered = turf.buffer(line, tolerance, { units: 'meters' })

            if (
                buffered &&
                buffered.geometry &&
                buffered.geometry.type === 'Polygon' &&
                buffered.geometry.coordinates.length > 0
            ) {
                const polygon = buffered.geometry.coordinates[0]
                existingPolygons[startIndex + i] = polygon
            }
        }

        fs.writeFileSync(outputPath, JSON.stringify(existingPolygons, null, 2), 'utf8')
    } catch (err) {
        console.error('❌ Error in makePolygon:', err)
    }
}

exports.getRoutes = async (req, res) => {
    try {
        const routes = await Routes.findAll()

        res.json({ routes: routes })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getRouteById = async (req, res) => {
    try {
        const { id } = req.body

        const routes = await Routes.findAll({
            where: {
                path_id: id
            }
        })

        res.json({ routes: routes })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteRoute = async (req, res) => {
    try {
        let { id } = req.body
    
        if (!Array.isArray(id)) {
            id = [parseInt(id)]
        } else {
            id = id.map(Number)
        }

        const kmzFolderPath = path.join(__dirname, "../kmz")
        const rutePath = path.join(kmzFolderPath, "rute_vt.json")
        const polygonPath = path.join(kmzFolderPath, "polygon_vt.json")
    
        let ruteData = JSON.parse(fs.readFileSync(rutePath, "utf8"))
        let polygonData = []

        if (fs.existsSync(polygonPath)) {
            polygonData = JSON.parse(fs.readFileSync(polygonPath, "utf8"))
        }
    
        const validIds = id.filter(idx => !isNaN(idx) && idx >= 0 && idx < ruteData.length)
        if (validIds.length === 0) {
            return res.status(404).json({ message: "Tidak ada ID yang valid untuk dihapus" })
        }

        validIds.sort((a, b) => b - a)
    
        validIds.forEach(idx => {
            ruteData.splice(idx, 1)
            if (idx < polygonData.length) {
                polygonData.splice(idx, 1)
            }
        })

        for (let i = 0; i < ruteData.length; i++) {
            ruteData[i].path_id = i
        }
    
        fs.writeFileSync(rutePath, JSON.stringify(ruteData, null, 2))
        fs.writeFileSync(polygonPath, JSON.stringify(polygonData, null, 2))

        await Routes.destroy({
            where: {
                path_id: {
                    [Op.in]: validIds
                }
            }
        })

        const minDeleted = Math.min(...validIds)

        await Routes.increment('path_id', {
        by: -validIds.length,
        where: {
            path_id: {
                [Op.gt]: minDeleted
            }
        }
    })

    res.json({
        message: `Berhasil menghapus ${validIds.length} path dan polygon, serta menyusun ulang path_id`,
        deleted_ids: validIds
    })
    } catch (error) {
        console.error("Error saat menghapus route:", error)
        res.status(500).json({ message: error.message })
    }
}  

exports.renameRoute = async (req, res) => {
    const { id, name, tolerance } = req.body

    try {
        const route = await Routes.findOne({ where: { path_id: id } })
        if (!route) {
            return res.status(404).json({ message: "Route tidak ditemukan di database" })
        }

        route.name = name
        if (tolerance !== undefined) {
            route.tolerance = tolerance
        }
        await route.save()

        const rutePath = path.join(__dirname, '..', 'kmz', 'rute_vt.json')
        const polygonPath = path.join(__dirname, '..', 'kmz', 'polygon_vt.json')

        const ruteData = JSON.parse(fs.readFileSync(rutePath, 'utf8'))
        const polyline = ruteData[id]

        if (!polyline) {
            return res.status(404).json({ message: "Polyline tidak ditemukan dalam rute_vt.json" })
        }

        const line = turf.lineString(polyline)
        const buffered = turf.buffer(line, tolerance, { units: 'meters' })

        if (!buffered || !buffered.geometry || buffered.geometry.type !== 'Polygon') {
            return res.status(500).json({ message: "Gagal membuat polygon dari polyline" })
        }

        let polygonData = []
        if (fs.existsSync(polygonPath)) {
            try {
                polygonData = JSON.parse(fs.readFileSync(polygonPath, 'utf8'))
                if (!Array.isArray(polygonData)) polygonData = []
            } catch (err) {
                polygonData = []
            }
        }

        polygonData[id] = buffered.geometry.coordinates[0]

        fs.writeFileSync(polygonPath, JSON.stringify(polygonData, null, 2), 'utf8')

        res.json({
            message: "Berhasil mengganti nama dan tolerance route",
            updated: { id, name, tolerance }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.makePolygonn = (req, res) => {
    try {
        const { tolerance } = req.body

        const inputPath = path.join(__dirname, '..', 'kmz', 'rute_vt.json')
        const rawData = fs.readFileSync(inputPath, 'utf8')
        const polylineList = JSON.parse(rawData)

        const polygonCoordinates = []

        for (const polyline of polylineList) {
            const line = turf.lineString(polyline)
            const buffered = turf.buffer(line, tolerance, { units: 'meters' })

            if (
                buffered &&
                buffered.geometry &&
                buffered.geometry.type === 'Polygon' &&
                buffered.geometry.coordinates.length > 0
            ) {
                polygonCoordinates.push(buffered.geometry.coordinates[0])
            }
        }

        const outputPath = path.join(__dirname, '..', 'kmz', 'polygon_vt.json')
        fs.writeFileSync(outputPath, JSON.stringify(polygonCoordinates, null, 2), 'utf8')

        res.json({
            status: 'success',
            message: 'Berhasil mengubah polyline menjadi polygon dan menyimpan ke polygon_vt.json',
            total: polygonCoordinates.length
        })
    } catch (err) {
        console.error('❌ Error:', err)
        res.status(500).json({ status: 'error', message: err.message })
    }
}