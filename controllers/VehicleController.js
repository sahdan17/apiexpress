const Vehicle = require('../models/Vehicle')
const { Op } = require("sequelize")
const moment = require('moment')

exports.getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findAll()

        res.json(vehicle)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.storeVehicle = async (req, res) => {
    try {
        const { nopol, kode, cat } = req.body

        const vehicle = await Vehicle.create({
            nopol: nopol,
            kode: kode,
            cat: cat
        })

        res.json(vehicle)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}