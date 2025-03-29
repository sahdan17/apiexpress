const express = require('express')
const { 
    register,
    login,
    getUser
} = require('../controllers/UsersController')
const authenticateToken = require('../middlewares/AuthMiddleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/getUser', authenticateToken, getUser)

module.exports = router