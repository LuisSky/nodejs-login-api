
jest.mock('jsonwebtoken', () => {
  return {
    sign (payload, secretTokenCode) {
      this.tokenSecretCode = secretTokenCode
      this.payload = payload
      this.token = 'any_token'
      return this.token
    }
  }
})

const TokenGenerator = require('./token-generator')

const makeSut = () => {
  const jwt = require('jsonwebtoken')

  const secretTokenCode = 'any_secret_token'

  const sut = new TokenGenerator(secretTokenCode)
  return {
    sut,
    jwt,
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
    const { sut, secretTokenCode, jwt } = makeSut()

    await sut.generate('any')

    expect(jwt.tokenSecretCode).toBe(secretTokenCode)
  })

  test('Should call JWT with correct params', async () => {
    const { sut, jwt } = makeSut()

    const payload = {
      anyObject: 'any_object'
    }
    await sut.generate(payload)

    expect(jwt.payload).toBe(payload)
  })

  test('Should return null if no payload is provided', async () => {
    const { sut } = makeSut()

    const token = await sut.generate()

    expect(token).toBeNull()
  })

  test('Should return an token if payload is provided', async () => {
    const { sut, jwt } = makeSut()

    const payload = 'any_payload'
    const token = await sut.generate(payload)

    expect(token).toBe(jwt.token)
  })
})
