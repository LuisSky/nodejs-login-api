import jwt from 'jsonwebtoken'
import { ITokenGenerator } from '../protocols'

export class TokenGenerator implements ITokenGenerator {
  constructor (
    readonly tokenSecretCode: string
  ) {}

  async generate (payload: object): Promise<string | null> {
    const token = jwt.sign(payload, this.tokenSecretCode, {
      expiresIn: 300
    })
    return token
  }
}
