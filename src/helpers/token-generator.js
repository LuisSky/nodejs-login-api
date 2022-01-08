const jwt = require('jsonwebtoken')
const config = require('../config/server.js')

class TokenGenerator {
  generate(payload) {
      const token = jwt.sign(payload, config.SECRET_TOKEN_PHRASE, {
        expiresIn: 300 
      })
      return token
  }
  async decode(token) {
    const decoded = await jwt.verify(token, config.SECRET_TOKEN_PHRASE)
    return decoded
  }
}

module.exports = TokenGenerator
