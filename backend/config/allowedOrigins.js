const allowedOrigins = [
    'http://localhost:8000',
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean)

module.exports = allowedOrigins