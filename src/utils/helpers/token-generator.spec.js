const TokenGenerator = require('./token-generator')

const makeSut = () => {
  const secretTokenCode = 'any_secret_token'

  return new TokenGenerator(secretTokenCode)
}

describe('TokenGenerator', () => {
  test('Should receive Secret-Code on this constructor', () => {
    const secretCode = 'any-toke-code'
    const sut = new TokenGenerator(secretCode)

    expect(sut.tokenSecretCode).toBe(secretCode)
  })
})
