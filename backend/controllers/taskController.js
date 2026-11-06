const Project = require('../models/Project')

const addTasks = async (req, res) => {
    const {projectId} = req.params
    const {tasks} = req.body

    if(!Array.isArray(tasks) || !tasks.length || tasks.some((task) => typeof task !== 'string' || !task.trim())) {
        return res.status(400).json({ error: "Tasks must be a non-empty array of text."})
    }

    try {
        const project = await Project.findOne({_id: projectId, owner: req.user.id})
        if(!project) {
            return res.status(404).json({error: "Project not found."})
        }

        project.tasks.push(...tasks.map((text) => ({text: text.trim()})))
        await project.save()

        res.json(project)
    } catch (error) {
        console.error("Add tasks error:", error)
        res.status(500).json({error: "Server error."})
    }
}

const toggleTask = async(req, res) => {
    const {projectId, taskId} = req.params
    const {completed} = req.body

    try {
        const project = await Project.findOne({_id: projectId, owner: req.user.id})
        if(!project) {
            return res.status(404).json({error: "Project not found."})
        }

        const task = project.tasks.id(taskId)
        if(!task) {
            return res.status(404).json({error: "Task not found."})
        }

        task.completed = Boolean(completed)
        await project.save()

        res.json(task)
    } catch (error) {
        console.error("Toggle task error:", error)
        res.status(500).json({error: "Server error."})
    }
}

module.exports = {addTasks, toggleTask}