const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10min
    standardHeaders: true,
    max: 5,
    legacyHeaders: false,
    message: {error: "Too many attempts. Please try again in 10 minutes."},
    skipSuccessfulRequests: true
})

const apiLimiter = rateLimit({
    windowMs: 60* 60* 1000, //1 hour
    max: 100,
    message: {error: "Too many requests from this IP address."}
})

module.exports = {authLimiter, apiLimiter}