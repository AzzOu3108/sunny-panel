const Project = require('../models/Project')

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({owner: req.user.id}).sort({createdAt: -1})
        return res.status(200).json(projects)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to fetch projects' })
    }
}

const createProjects = async (req, res) => {
    const {title, dueDate, tasks} = req.body

    if(typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: "Give your project a title" })
    }

    if(tasks !== undefined && !Array.isArray(tasks)) {
        return res.status(400).json({ error: "Tasks must be an array" })
    }

    try {
        const project = await Project.create({
            owner: req.user.id,
            title: title.trim(),
            dueDate: dueDate || "",
            tasks: (tasks || []).map((task) =>
                typeof task === 'string' ? { text: task } : task
            )
        })

        res.status(201).json(project)
    } catch (error) {
        console.error("Create project error:", error)
        res.status(500).json({error: "Server error."})
    }
}

const deleteProject = async (req, res) => {
    const {projectId} = req.params

    try {
        const project = await Project.findOneAndDelete({_id: projectId, owner: req.user.id})
        if(!project) {
            return res.status(404).json({error: "Project not found"})
        }
        return res.sendStatus(204)
    } catch (error) {
        console.log("Delete project error:", error)
        res.status(500).json({error: "Server error."})
    }
}

module.exports = {
    getProjects,
    createProjects,
    deleteProject
}