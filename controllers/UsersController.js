const Users = require('../models/Users')
const { Op } = require("sequelize")
const moment = require('moment')
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body

    try {
        const existingUser = await Users.findOne({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const users = await Users.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        })

        res.json({
            message: "Email berhasil didaftarkan",
            user: users
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}