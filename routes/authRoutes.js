const express = require('express')
const router = express.Router()
const { register, login, getProfile } = require('../controllers/authController')
const { protect, registerGuard } = require('../middleware/authMiddleware')

router.post('/register', registerGuard, register)
router.post('/login',    login)
router.get('/profile',   protect, getProfile)

module.exports = router