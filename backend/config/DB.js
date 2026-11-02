require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
    const uri = process.env.MONGO_URI

    if(!uri) {
        console.warn(
         "[db] MONGO_URI is not set. Add your MongoDB connection string to backend/.env (see .env.example), then restart the server."
        )
        return null
    }

    if(uri.includes("<") && uri.includes(">")) {
        console.warn(
            "[db] MONGO_URI still contains a placeholder (e.g. <db_username>). Replace it with your real Atlas credentials in backend/.env."
        )
        return null
    }

    mongoose.set("strictQuery", true)

    mongoose.connection.on("error", (err) => {
        console.log("[db] Connection error:", err.message)
    })

    const connection = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10_000,
    })

    console.log(
        `[db] MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
    )
    return connection
}

module.exports = connectDB