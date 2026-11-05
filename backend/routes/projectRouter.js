const {Router} =  require('express')
const { getProjects, createProjects, deleteProject } = require('../controllers/projectController')


const router = Router()

router.route("/")
    .get(getProjects)
    .post(createProjects)

router.route("/:projectId")
    .delete(deleteProject)


module.exports = router