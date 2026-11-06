const jwt = require('jsonwebtoken')
const {v4 : uuid} = require('uuid')

const generateToken = (userId, type) => {
    const isAccess = type ==="access"
    const secret = isAccess ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET
    const expiresIn = isAccess
        ? process.env.ACCESS_TOKEN_EXPIRATION || "30m"
        : process.env.REFRESH_TOKEN_EXPIRATION || "7d"

    return jwt.sign({ sub: userId, jwt: uuid()}, secret, {expiresIn})
}

module.exports = generateToken