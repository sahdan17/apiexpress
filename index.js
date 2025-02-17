require('dotenv').config()
const express = require('express')
const sequelize = require('./config/database')
const recordRoutes = require('./routes/RecordRoutes')
const vehicleRoutes = require('./routes/VehicleRoutes')
const cors = require('cors')

const app = express()

app.use(cors)

app.use(express.json())

app.use('/api', recordRoutes)
app.use('/api', vehicleRoutes)

sequelize.sync({ force: false })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database error:', err))

app.listen(1762, () => console.log('Server running on port 1762 anjay'))