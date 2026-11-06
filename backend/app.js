require('dotenv').config()
const express = require('express')
const corsOptions = require('./config/corsOptions')
const cors = require('cors')
const helmet = require('helmet')
const projectRouter = require('./routes/projectRouter')
const taskRouter = require('./routes/taskRouter')
const statsRouter = require('./routes/statsRouter')
const authRouter = require('./routes/authRouter')
const { apiLimiter } = require('./middleware/rateLimiter')

const app = express()

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api', apiLimiter)

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy'})
})

app.use("/api/projects", projectRouter)
app.use("/api/projects", taskRouter)
app.use("/api/stats", statsRouter)
app.use("/api/auth", authRouter)

app.use((req, res) => {
    res.status(404).json({error: `No route for ${req.method} ${req.originalUrl}`})
})

module.exports = app
