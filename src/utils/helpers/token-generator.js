const jwt = require('jsonwebtoken')

class TokenGenerator {
  constructor (secretCode) {
    this.tokenSecretCode = secretCode
  }

  generate (payload) {
    if (!payload) return null
    const token = jwt.sign(payload, this.tokenSecretCode, {
      expiresIn: 300
    })
    return token
  }

  async decode (token) {
    if (!token) return null
    const decoded = await jwt.verify(token, this.tokenSecretCode)
    return decoded
  }
}

module.exports = TokenGenerator
