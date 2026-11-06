const { Router } = require('express')
const { signup, login, refresh, logout, me } = require('../controllers/authController')
const { isAuthenticated } = require('../middleware/authMiddleware')
const { authLimiter } = require('../middleware/rateLimiter')

const router = Router()

router.post('/signup', authLimiter, signup)
router.post('/login', authLimiter, login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', isAuthenticated, me)

module.exports = router
