const env = require('../../config/env')
const jwt = require('jsonwebtoken')

class TokenGenerator {
  generate (payload) {
    const token = jwt.sign(payload, env.SECRET_TOKEN_PHRASE, {
      expiresIn: 300
    })
    return token
  }

  async decode (token) {
    const decoded = await jwt.verify(token, env.SECRET_TOKEN_PHRASE)
    return decoded
  }
}

module.exports = TokenGenerator
