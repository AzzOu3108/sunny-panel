require('dotenv').config()
const connectDB = require('./config/DB')
const app = require('./app')

const PORT = process.env.PORT || 3000

const startServer = async() => {
    try {
        await connectDB()
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    } catch (error) {
        console.error("Unable to connect to the database:", error)
    }
}

startServer()