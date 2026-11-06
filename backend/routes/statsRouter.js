const {Router} = require('express')
const { getStats } = require('../controllers/statsController')
const { isAuthenticated } = require('../middleware/authMiddleware')


const router = Router()

router.use(isAuthenticated)

router.route("/").get(getStats)

module.exports = router
