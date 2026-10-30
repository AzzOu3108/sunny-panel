require('dotenv').config()
const express = require('express')
const corsOptions = require('./config/corsOptions')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

const PORT = process.env.PORT || 3000

//Security headrs
app.use(helmet())

//CORS
app.use(cors(corsOptions))

//JSON body parsing
app.use(express.json())

//Health check endpoint
app.get('/api/health', (req, res) =>{
    res.status(200).json({ message: 'Server is healthy'})
})

//404 for unknown routes
app.use((req, res) => {
    res.status(404).json({error: `No route for ${req.method} ${req.originalUrl}`})
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))