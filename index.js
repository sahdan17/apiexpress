require('dotenv').config()
const express = require('express')
const sequelize = require('./config/database')
const recordRoutes = require('./routes/RecordRoutes')
const vehicleRoutes = require('./routes/VehicleRoutes')
const cors = require('cors')



const allowedOrigins = ['https://apigps.findingoillosses.com']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

const app = express()

app.use(express.json())

app.use('/api', recordRoutes)
app.use('/api', vehicleRoutes)

sequelize.sync({ force: false })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database error:', err))

app.listen(7718, () => console.log('Server running on port 7718 anjay'))