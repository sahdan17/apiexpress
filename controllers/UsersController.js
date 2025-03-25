const Users = require('../models/Users')
const { Op } = require("sequelize")
const moment = require('moment')
const bcrypt = require('bcryptjs')

function validatePassword(password) {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)

    if (password.length < minLength) {
        return 'Password minimal 8 karakter'
    }
    if (!hasUpperCase) {
        return 'Password harus mengandung huruf kapital'
    }
    if (!hasNumber) {
        return 'Password harus mengandung angka'
    }

    return null
}

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

        const passwordError = validatePassword(password)
        if (passwordError) {
            return res.status(400).json({ message: passwordError })
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