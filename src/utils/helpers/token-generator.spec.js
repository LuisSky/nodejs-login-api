
jest.mock('jsonwebtoken', () => {
  return {
    sign (payload, secretTokenCode) {
      this.tokenSecretCode = secretTokenCode
      this.payload = payload
      return 'any_token'
    }
  }
})

const TokenGenerator = require('./token-generator')
const jwt = require('jsonwebtoken')

const makeSut = () => {
  const secretTokenCode = 'any_secret_token'

  const sut = new TokenGenerator(secretTokenCode)
  return {
    sut,
    secretTokenCode
  }
}

describe('TokenGenerator', () => {
  test('Should receive Secret-Code on this constructor', () => {
    const secretCode = 'any-toke-code'
    const sut = new TokenGenerator(secretCode)

    expect(sut.tokenSecretCode).toBe(secretCode)
  })

  test('Should call JWT with correct secret-token-code', async () => {
    const { sut, secretTokenCode } = makeSut()

    await sut.generate('any')

    expect(jwt.tokenSecretCode).toBe(secretTokenCode)
  })
})
