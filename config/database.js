require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: "+07:00",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000, // Waktu maksimum untuk mendapatkan koneksi
        idle: 10000     // Waktu idle sebelum koneksi dihapus
    },
    retry: {
        max: 5 // Coba ulang koneksi hingga 5 kali jika gagal
    }
})

module.exports = sequelize