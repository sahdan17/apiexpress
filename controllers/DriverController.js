const RFIDTemp = require('../models/RFIDTemp')
const Driver = require('../models/Driver')
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