const Vehicle = require('../models/Vehicle')
const { Op } = require("sequelize")
const moment = require('moment')
const Category = require('../models/Category')

exports.getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findAll({
            include: [
                {
                    model: Category,
                    attributes: ['nama_cat'],
                    as: 'category'
                }
            ],
        })

        const flattened = vehicle.map(v => ({
            id: v.id,
            nopol: v.nopol,
            kode: v.kode,
            cat: v.cat,
            category: v.category.nama_cat
        }))

        res.json(flattened)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findAll()

        res.json(category)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getVehicleByCat = async (req, res) => {
    try {
        const { cat } = req.body

        const vehicle = await Vehicle.findAll({
            where: {
                cat: cat
            }
        })

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

exports.updateVehicle = async (req, res) => {
    try {
        const { id, nopol, kode } = req.body

        const vehicle = await Vehicle.findByPk(id)

        if (!vehicle) {
            res.status(500).json({ message: "Kendaraan tidak ditemukan" })
        }

        vehicle.nopol = nopol
        vehicle.kode = kode

        await vehicle.save()

        res.json(vehicle)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.body

        await Vehicle.destroy({
            where: {
                id: id
            }
        })

        res.json({ message: "Hapus kendaraan berhasil" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteVehicleInCat = async (req, res) => {
    try {
        const { cat } = req.body

        await Vehicle.destroy({
            where: {
                cat: cat
            }
        })

        res.json({ message: "Hapus kendaraan berhasil" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}