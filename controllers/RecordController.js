const Record = require('../models/Record')
const LastRecord = require('../models/LastRecord')
const Vehicle = require('../models/Vehicle')
const { Op, Sequelize } = require("sequelize")
const moment = require('moment')
const fs = require("fs")
const turf = require("@turf/turf")
const DriveSession = require('../models/DriveSession')
const Driver = require('../models/Driver')
const axios = require("axios")

exports.storeRecord = async (req, res) => {
    try {
        const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
        const { lat, long, speed, sat, dir, status, idDevice } = req.body

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
            timestamp: timestamp
        })

        const areaCheckResult = await checkAreaInternal(lat, long)

        if (areaCheckResult.inArea == false) {
            try {
                const vehicle = await Vehicle.findOne({
                    where: {
                        id: idDevice
                    }
                })

                await axios.post("https://folpertaminafieldjambi.com/api/sendToDB",
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
        console.log("Latitude:", lat)
        console.log("Longitude:", lng)

        res.json(areaCheckResult)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const checkAreaInternal = async (lat, long) => {
    try {
        // const data = fs.readFileSync("./kmz/pps-sgl.json", "utf8")
        const data = fs.readFileSync("./kmz/rute_vt.json", "utf8")

        const polylines = JSON.parse(data)

        let nearestDistance = Infinity
        let nearestPolyline = null

        polylines.forEach(polyline => {
            var line = turf.lineString(polyline)

            const pt = turf.point([long, lat])
            const nearestPoint = turf.nearestPointOnLine(line, pt)
            const distance = turf.distance(pt, nearestPoint, { units: "meters" })

            if (distance < nearestDistance) {
                nearestDistance = distance
                nearestPolyline = polyline
            }
        })

        var check = nearestDistance <= 20
        var message = ""

        if (check) {
            message = "Titik koordinat berada di dalam area"
        } else {
            message = "Titik koordinat berada di luar area"
        }

        return {
            point: { latitude: lat, longitude: long },
            distance: nearestDistance.toFixed(2),
            inArea: check,
            message: message
        }
    } catch (error) {
        return { message: "Gagal memeriksa area", error: error.message }
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

exports.getLatestRecords = async (req, res) => {
    try {
        const records = await LastRecord.findAll()
        res.json(records)
    } catch (error) {
        console.log(error)
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
        console.log(error)
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
        });

        res.json(coordinates)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}