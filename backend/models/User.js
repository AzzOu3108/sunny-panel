const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            require: true,
            minlength: 8,
            select: false,
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false
        }
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User