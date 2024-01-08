import jwt from 'jsonwebtoken'
import { ITokenGenerator } from '../protocols'

export class TokenGenerator implements ITokenGenerator {
  constructor (
    readonly tokenSecretCode: string
  ) {}

  generate (payload: object): string | null {
    if (!payload) return null
    const token = jwt.sign(payload, this.tokenSecretCode, {
      expiresIn: 300
    })
    return token
  }
}
