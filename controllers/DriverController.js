const RFIDTemp = require('../models/RFIDTemp')
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