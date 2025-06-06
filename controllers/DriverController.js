const RFIDTemp = require('../models/RFIDTemp')
const Driver = require('../models/Driver')
const DriveSession = require('../models/DriveSession')
const { Op } = require("sequelize")
const moment = require('moment')

exports.getDriver = async (req, res) => {
    try {
        const driver = await Driver.findAll()

        res.json(driver)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.storeRFIDTemp = async (req, res) => {
    try {
        const { rfid } = req.body

        await RFIDTemp.destroy({ where: {} })

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

exports.checkRFIDTemp = async (req, res) => {
    try {
        const rfidTemp = await RFIDTemp.findAll()

        if (rfidTemp.length == 0) {
            res.status(500).json({ message: "RFID kosong" })
        }

        res.json(rfidTemp)
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

exports.updateDriver = async (req, res) => {
    try {
        const { id, driver_name, no_wa } = req.body

        const driver = await Driver.findByPk(id)

        if (!driver) {
            res.status(500).json({ message: "Driver tidak ditemukan" })
        }

        driver.driver_name = driver_name
        driver.no_wa = no_wa

        await driver.save()

        res.json(driver)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.body

        await Driver.destroy({
            where: {
                id: id
            }
        })

        res.json({ message: "Hapus driver berhasil" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.driveSession = async (req, res) => {
    try {
        const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

        const { rfid, vehicle_id } = req.body        

        let driveNew = {}

        const driveSess = await DriveSession.findOne({
            where: {
                vehicle_id: vehicle_id
            },
            include: [
                {
                    model: Driver,
                    as: 'driver'
                }
            ],
            order: [
                ['id', 'DESC']
            ]
        })

        if (driveSess && driveSess.driver.rfid == rfid) {
            if (driveSess.stop == undefined) {
                driveNew = await DriveSession.update({
                    stop: timestamp
                },
                {
                    where: {
                        id: driveSess.id
                    }
                })
            } else {
                driveNew = await DriveSession.create({
                    vehicle_id: vehicle_id,
                    driver_id: driveSess.driver.id,
                    start: timestamp
                })
            }
        } else if (driveSess && driveSess.driver.rfid != rfid) {
            const driverRFID = await Driver.findOne({
                where: {
                    rfid: rfid
                }
            })
            
            if (driverRFID) {
                driveNew = await DriveSession.create({
                    vehicle_id: vehicle_id,
                    driver_id: driverRFID.id,
                    start: timestamp
                })
    
                await DriveSession.update({
                    stop: timestamp
                },
                {
                    where: {
                        id: driveSess.id
                    }
                })
            } else {
                res.status(400).json({ message: "Driver belum terdaftar" })
            }
        } else {
            const driverRFID = await Driver.findOne({
                where: {
                    rfid: rfid
                }
            })
            
            driveNew = await DriveSession.create({
                vehicle_id: vehicle_id,
                driver_id: driverRFID.id,
                start: timestamp
            })
        }

        res.json({
            message: "Data berhasil tersimpan",
            data: driveNew
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: error.message })
    }
}