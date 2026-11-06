const Project = require('../models/Project')

const getStats = async (req, res) => {
    try {
        const projects = await Project.find({owner: req.user.id}).select('tasks')

        let completedTasks = 0
        let pendingTasks = 0

        projects.forEach((project) => {
            project.tasks.forEach((task) => {
                if(task.completed) completedTasks += 1
                else pendingTasks += 1
            })
        })

        res.json({
            totalProjects: projects.length,
            completedTasks,
            pendingTasks,
        })
    } catch (error) {
        console.log("Stats error:", error)
        res.status(500).json({error: "Server error."})
    }
}

module.exports = {getStats}