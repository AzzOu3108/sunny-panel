const {Router} = require('express')
const { addTasks, toggleTask } = require('../controllers/taskController')
const { isAuthenticated } = require('../middleware/authMiddleware')


const router = Router()

router.use(isAuthenticated)

router.route("/:projectId/tasks")
    .post(addTasks)

router.route("/:projectId/tasks/:taskId")
    .patch(toggleTask)

module.exports = router