require('dotenv').config()

const jwt = require('jsonwebtoken')

class TokenGenerator {
  generate(payload) {
      const token = jwt.sign(payload, process.env.SECRET_TOKEN_PHRASE, {
        expiresIn: 300 
      })
      return token
  }
  async decode(token) {
    const decoded = await jwt.verify(token, process.env.SECRET_TOKEN_PHRASE)
    return decoded
  }
}

module.exports = TokenGenerator
