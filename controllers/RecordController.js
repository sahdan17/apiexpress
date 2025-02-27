const Record = require('../models/Record')
const LastRecord = require('../models/LastRecord')
const Vehicle = require('../models/Vehicle')
const { Op } = require("sequelize")
const moment = require('moment')
const fs = require("fs")
const turf = require("@turf/turf")

exports.storeRecord = async (req, res) => {
    try {
        const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
        const { lat, long, speed, sat, dir, status, idDevice } = req.body

        await Record.create({
            lat: lat,
            long: long,
            speed: speed,
            sat: sat,
            dir: dir,
            status: status,
            idDevice: idDevice,
            timestamp: timestamp
        })

        await LastRecord.upsert({
            idDevice: idDevice,
            lat: lat,
            long: long,
            speed: speed,
            sat: sat,
            dir: dir,
            status: status,
            timestamp: timestamp
        })

        const areaCheckResult = await checkAreaInternal(lat, long)

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
        const data = fs.readFileSync("./kmz/pps-sgl.json", "utf8")

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
            isWithinTolerance: check,
            message: message
        }
    } catch (error) {
        return { message: "Gagal memeriksa area", error: error.message }
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
                    model: Vehicle,
                    as: 'vehicle'
                }
            ],
            order: [
                ['id', 'DESC']
            ]
        })

        res.json(records)
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
            }
        })

        res.json(records)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}