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
                console.log(driveSess.stop)
                console.log('masuk1')
                
                driveNew = await DriveSession.update({
                    stop: timestamp
                },
                {
                    where: {
                        id: driveSess.id
                    }
                })
            } else {
                console.log('masuk2')
                
                driveNew = await DriveSession.create({
                    vehicle_id: vehicle_id,
                    driver_id: driveSess.driver.id,
                    start: timestamp
                })
            }
        } else if (driveSess && driveSess.driver.rfid != rfid) {
            console.log('masuk3')

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

            await DriveSession.update({
                stop: timestamp
            },
            {
                where: {
                    id: driveSess.id
                }
            })
        }

        // if (!driveSess || driveSess.stop == null) {
        //     driveNew = await DriveSession.create({
        //         vehicle_id: vehicle_id,
        //         driver_id: driver.id,
        //         start: timestamp
        //     })
        // } else {
        //     driveNew = await DriveSession.update({
        //         stop: timestamp
        //     },
        //     {
        //         where: {
        //             id: driveSess.id
        //         }
        //     })
        // }

        res.json({
            message: "Data berhasil tersimpan",
            data: driveNew
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}