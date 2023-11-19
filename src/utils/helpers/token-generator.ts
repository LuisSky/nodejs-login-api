import jwt from 'jsonwebtoken'


export default class TokenGenerator {
  constructor (
    private readonly tokenSecretCode: string
  ) {}

  generate (payload: object) {
    if (!payload) return null
    const token = jwt.sign(payload, this.tokenSecretCode, {
      expiresIn: 300
    })
    return token
  }

  decode (token: string) {
    if (!token) return null
    const decoded = jwt.verify(token, this.tokenSecretCode)
    return decoded
  }
}