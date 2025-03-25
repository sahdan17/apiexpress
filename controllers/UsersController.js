const Users = require('../models/Users')
const { Op } = require("sequelize")
const moment = require('moment')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET

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
    const { name, email, password } = req.body

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
            role: 1
        })

        res.json({
            message: "Email berhasil didaftarkan"
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await Users.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(401).json({ message: 'Email tidak ditemukan' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password salah' })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '6h' }
        )

        res.json({ 
            message: 'Login berhasil', 
            token: token 
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}