const jwt = require('jsonwebtoken')
const config = require('../config/server.js')

class TokenGenerator {
  generate(payload) {
      const token = jwt.sign(payload, config.SECRET_TOKEN_PHRASE)
      return token
  }
}

module.exports = TokenGenerator
