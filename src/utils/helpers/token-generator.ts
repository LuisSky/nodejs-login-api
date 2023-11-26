import jwt, { JwtPayload } from 'jsonwebtoken'


export default class TokenGenerator {
  constructor (
    readonly tokenSecretCode: any
  ) {}

  generate (payload: unknown): string | null {
    if (!payload) return null
    const token = jwt.sign(payload, this.tokenSecretCode, {
      expiresIn: 300
    })
    return token
  }

  decode (token: any): JwtPayload | null | string {
    if (!token) return null
    const decoded = jwt.verify(token, this.tokenSecretCode)
    return decoded
  }
}