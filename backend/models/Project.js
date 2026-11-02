const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
        }
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
        }
    }
)

const projectSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            default: "",
        },
        dueDate: {
            type: String,
            default: "",
        },
        tasks: [taskSchema]
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false
        }
    }
)

const Project = mongoose.model('Project', projectSchema)

module.exports = Project