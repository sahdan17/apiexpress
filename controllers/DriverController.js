const RFIDTemp = require('../models/RFIDTemp')
const { Op } = require("sequelize")
const moment = require('moment')

exports.storeRFIDTemp = async (req, res) => {
    try {
        const { rfid } = req.body

        await RFIDTemp.create({
            rfid: rfid,
        })

        res.json({
            status: "success",
            message: "Data berhasil disimpan"
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}