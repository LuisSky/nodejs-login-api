
jest.mock('jsonwebtoken', () => {
  return {
    tokenSecretCode: '',
    payload: '',
    token: '',
    isValidToken: true,

    sign (payload, secretTokenCode) {
      this.tokenSecretCode = secretTokenCode
      this.payload = payload
      this.token = 'any_token'
      return this.token
    },
    async verify (token) {
      if (this.isValidToken) {
        return this.payload
      } else return this.isValidToken
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

  test('Should return null if no decode token is provided', async () => {
    const { sut } = makeSut()

    const payload = 'any_payload'
    await sut.generate(payload)
    const decodeToken = await sut.decode()

    expect(decodeToken).toBeNull()
  })

  test('Should return false if invalid token is provided', async () => {
    const { sut, jwt } = makeSut()

    const payload = 'any_payload'
    jwt.isValidToken = false
    await sut.generate(payload)
    const decodeToken = await sut.decode('invalid_token')

    expect(decodeToken).toBe(false)
  })

  test('Should return original payload if valid token is provided', async () => {
    const { sut, jwt } = makeSut()
    jwt.isValidToken = true
    const payload = 'any_payload'
    const token = await sut.generate(payload)
    const decodeToken = await sut.decode(token)

    expect(decodeToken).toBe(payload)
  })
})
