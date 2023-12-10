import jwt, { JwtPayload } from 'jsonwebtoken'
import { ITokenGenerator } from '../protocols'

export class TokenGenerator implements ITokenGenerator {
  constructor (
    readonly tokenSecretCode: string
  ) {}

  generate (payload: unknown): string | null {
    if (!payload) return null
    const token = jwt.sign(payload, this.tokenSecretCode, {
      expiresIn: 300
    })
    return token
  }

  decode (token: string): JwtPayload | null | string {
    if (!token) return null
    const decoded = jwt.verify(token, this.tokenSecretCode)
    return decoded
  }
}
