const RFIDTemp = require('../models/RFIDTemp')
const Driver = require('../models/Driver')
const DriveSession = require('../models/DriveSession')
const { Op } = require("sequelize")
const moment = require('moment')

exports.storeRFIDTemp = async (req, res) => {
    try {
        const { rfid } = req.body

        const rfidTemp = await RFIDTemp.findAll()

        if (rfidTemp.length == 0) {
            await RFIDTemp.create({
                rfid: rfid,
            })
        } else {
            res.status(500).json({ message: "Selesaikan pendaftaran RFID sebelumnya" })
        }

        res.json({
            status: "success",
            message: "Data berhasil disimpan"
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.createDriver = async (req, res) => {
    try {
        const { driver_name, no_wa } = req.body

        const rfidTemp = await RFIDTemp.findAll()

        if (rfidTemp.length > 0) {
            await Driver.create({
                rfid: rfidTemp[0].rfid,
                driver_name: driver_name,
                no_wa: no_wa
            })

            await RFIDTemp.destroy({ where: {} })
        } else {
            res.status(500).json({ message: "Lakukan tapping terlebih dahulu" })
        }

        res.json({
            status: "success",
            message: "Data berhasil disimpan"
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.driveSession = async (req, res) => {
    try {
        const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

        const { rfid, vehicle_id } = req.body

        const driver = await Driver.findOne({
            where:{
                rfid: rfid
            }
        })

        const driveNew = {};

        let driveSess = await DriveSession.findOne({
            where:{
                [Op.and]: {
                    vehicle_id: vehicle_id,
                    driver_id: driver.id
                }
            }
        })

        if (!driveSess) {
            driveNew = await DriveSession.create({
                vehicle_id: vehicle_id,
                driver_id: driver.id,
                start: timestamp
            })
        } else {
            driveNew = await DriveSession.update({
                id: driveSess.id
            },{
                stop: timestamp
            })
        }

        res.json({
            message: "Data berhasil tersimpan",
            data: driveNew
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}