const {Router} = require('express')
const { addTasks, toggleTask } = require('../controllers/taskController')


const router = Router()

router.route("/:projectId/tasks")
    .post(addTasks)

router.route("/:projectId/tasks/:taskId")
    .patch(toggleTask)

module.exports = router