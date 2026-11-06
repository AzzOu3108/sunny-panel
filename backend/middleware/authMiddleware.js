const jwt = require('jsonwebtoken')
const User = require('../models/User')

const isAuthenticated = async (req, res, next) => {
    const header = req.headers.authorization;

    if(!header) {
        return res.status(401).json({error: "Not authenticated"})
    }

    try {
        const token = header.replace("Bearer ", "").trim()
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.sub).select("-password")

        if(!user){
            return res.status(401).json({error: "User not found."})
        }

        req.user = user
        next()
    } catch (error) {
        console.error("Authentication error:", error.message)
        const message = error.name === "TokenExpiredError" ? "Session expired." : "Invalid token."
        res.status(401).json({error: message})
    }
}

module.exports = {isAuthenticated}