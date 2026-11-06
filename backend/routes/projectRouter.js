const {Router} =  require('express')
const { getProjects, createProjects, deleteProject } = require('../controllers/projectController')
const { isAuthenticated } = require('../middleware/authMiddleware')


const router = Router()

router.use(isAuthenticated)

router.route("/")
    .get(getProjects)
    .post(createProjects)

router.route("/:projectId")
    .delete(deleteProject)


module.exports = router