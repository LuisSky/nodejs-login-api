import { TokenGenerator } from './token-generator'
import jwt from 'jsonwebtoken'

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

  // TODO: remember to refactor this test
  // test('Should call JWT with correct secret-token-code', () => {
  //   const { sut, secretTokenCode } = makeSut()

  //   const jwtCalledWith = jest.spyOn(jwt, 'sign')

  //   sut.generate('any')

  //   expect(jwtCalledWith).toHaveBeenCalledWith('any', secretTokenCode, { expiresIn: 300 })
  // })

  // test('Should call JWT with correct params', async () => {
  //   const { sut, jwt } = makeSut()

  //   const payload = {
  //     anyObject: 'any_object'
  //   }
  //   await sut.generate(payload)

  //   expect(jwt.payload).toBe(payload)
  // })

  test('Should return null if no payload is provided', async () => {
    const { sut } = makeSut()

    const token = sut.generate('')

    expect(token).toBeNull()
  })

  test('Should return an token if payload is provided', async () => {
    const { sut } = makeSut()

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => 'any_token')
    const payload = 'any_payload'
    const token = sut.generate(payload)

    expect(token).toBe('any_token')
  })

  test('Should return null if no decode token is provided', async () => {
    const { sut } = makeSut()

    const decodeToken = sut.decode('')

    expect(decodeToken).toBeNull()
  })

  test('Should return undefined if invalid token is provided', async () => {
    const { sut } = makeSut()

    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => undefined)

    const decodeToken = sut.decode('invalid_token')

    expect(decodeToken).toBe(undefined)
  })

  test('Should return original payload if valid token is provided', async () => {
    const { sut } = makeSut()

    const payload = 'any_payload'

    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => payload)
    const decodeToken = sut.decode('valid_token')

    expect(decodeToken).toBe(payload)
  })
})
